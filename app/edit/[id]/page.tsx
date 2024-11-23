import EditForm from "@/components/edit-form";
import { getImageById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditPage ({params}: any) {
    const {id} = await params
    const data = await getImageById(id)
    
    if(!data) return notFound()
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 ">
            <div className="bg-white rounded-sm shadow p-8">
                <h1 className="text-2xl font-bold mb-5">Update Image</h1>
                <EditForm data={data}/>
            </div>
        </div>
    )
}