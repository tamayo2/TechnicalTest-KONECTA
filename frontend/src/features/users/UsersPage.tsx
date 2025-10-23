import { useListQuery, useCreateMutation, useUpdateMutation, useRemoveMutation } from './api';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
function UserForm({ initial, onDone }:{ initial?: any; onDone?: ()=>void }){
    const isEdit = !!initial?.id;
    const [create] = useCreateMutation();
    const [update] = useUpdateMutation();
    const { register, handleSubmit, reset, formState:{errors} } = useForm({
        defaultValues: initial ?? { role:'ADVISOR' }
    });
    const onSubmit = async (form: any) => {
        // Validaciones front
        if (!form.name || form.name.length>50) return;
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || form.email.length>50) return;
        if (!isEdit && (!form.password || form.password.length<6 || form.password.length>20)) return;
        if (isEdit) {
            const body:any = { name: form.name, email: form.email, role: form.role };
            if (form.password) body.password = form.password;
            await update({ id: initial.id, body }).unwrap();
            onDone?.();
        } else {
            await create(form).unwrap();
            reset({ role:'ADVISOR' });
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-2 items-end">
            <input className="border p-2" placeholder="Nombre" {...register('name', { required:true, maxLength:50 })} />
            <input className="border p-2" placeholder="Email" {...register('email', { required:true, maxLength:50 })} />
            <input className="border p-2" placeholder={isEdit?'Nueva contraseña (opcional)':'Contraseña'} type="password"
                   {...register('password', { minLength:isEdit?0:6, maxLength:20 })} />
            <select className="border p-2" {...register('role', { required:true })}>
                <option value="ADVISOR">Asesor</option>
                <option value="ADMIN">Administrador</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded">{isEdit?'Guardar':'Crear'}</button>
            <span className="text-sm text-red-600">
        {errors?.name && 'Nombre inválido '}
                {errors?.email && 'Email inválido '}
                {errors?.password && 'Contraseña inválida '}
      </span>
        </form>
    );
}
export default function UsersPage(){
    const { data, isLoading } = useListQuery();
    const [remove] = useRemoveMutation();
    const [editing, setEditing] = useState<any|null>(null);
    if (isLoading) return <div>Cargando...</div>;
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Gestión de usuarios</h2>
            <UserForm />
            {editing && (
                <div className="p-3 border rounded bg-gray-50">
                    <h3 className="font-medium mb-2">Editando: {editing.name}</h3>
                    <UserForm initial={editing} onDone={()=>setEditing(null)} />
                </div>
            )}
            <table className="w-full border">
                <thead>
                <tr className="bg-gray-50">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Nombre</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Rol</th>
                    <th className="p-2 text-left">Creado</th>
                    <th className="p-2">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((u:any)=>(
                    <tr key={u.id} className="border-t">
                        <td className="p-2">{u.id}</td>
                        <td className="p-2">{u.name}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.role === 'ADMIN' ? 'Administrador':'Asesor'}</td>
                        <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
                        <td className="p-2 flex gap-3 justify-center">
                            <button className="underline" onClick={()=>setEditing(u)}>Editar</button>
                            <button className="text-red-600 underline" onClick={()=>remove(u.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}