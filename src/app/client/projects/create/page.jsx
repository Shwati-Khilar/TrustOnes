// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//     ArrowLeft,
//     BriefcaseBusiness,
//     CalendarDays,
//     IndianRupee,
//     Loader2,
// } from "lucide-react";

// import ClientSidebar from "@/components/client/ClientSidebar";
// import ClientTopNav from "@/components/client/ClientTopNav";
// import ProjectForm from "@/components/client/ProjectContents/ProjectForm";

// const initialFormData = {
//     title: "",
//     description: "",
//     category: "",
//     budget: "",
//     deadline: "",
// };

// const categories = [
//     "Development",
//     "Design",
//     "Marketing",
//     "Writing",
//     "Data & AI",
//     "Other",
// ];
// const today = new Date().toISOString().split("T")[0];

// export default function CreateProjectPage() {
//     const router = useRouter();

//     const [formData, setFormData] = useState(initialFormData);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState("");

//     function handleChange(event) {
//         const { name, value } = event.target;

//         setFormData((current) => ({
//             ...current,
//             [name]: value,
//         }));

//         if (error) {
//             setError("");
//         }
//     }

//     async function handleSubmit(event) {
//         event.preventDefault();

//         if (submitting) {
//             return;
//         }

//         setError("");

//         try {
//             setSubmitting(true);

//             const response = await fetch("/api/projects", {
//                 method: "POST",

//                 headers: {
//                     "Content-Type": "application/json",
//                 },

//                 body: JSON.stringify({
//                     title: formData.title,
//                     description: formData.description,
//                     category: formData.category,
//                     budget: Number(formData.budget),
//                     deadline: formData.deadline,
//                 }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message || "Unable to create project."
//                 );
//             }

//             router.push("/client/projects");
//             router.refresh();
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setSubmitting(false);
//         }
//     }

//     return (
//         <>
//             <ClientSidebar />
//             <ClientTopNav />

//             <main className="ml-64 min-h-screen bg-[#F8F4EF] pt-20">
//                 <div className="mx-auto max-w-5xl p-6">
//                     <button
//                         type="button"
//                         onClick={() => router.back()}
//                         className="
//               mb-6
//               flex
//               items-center
//               gap-2
//               text-sm
//               font-medium
//               text-[#8B5A2B]
//               transition
//               hover:text-[#3D2414]
//             "
//                     >
//                         <ArrowLeft size={18} />
//                         Back to Projects
//                     </button>

//                     <section
//                         className="
//               overflow-hidden
//               rounded-[32px]
//               bg-gradient-to-r
//               from-[#8B5A2B]
//               to-[#5E381C]
//               p-8
//               text-white
//             "
//                     >
//                         <span
//                             className="
//                 inline-flex
//                 rounded-full
//                 bg-[#A06B36]
//                 px-4
//                 py-2
//                 text-sm
//                 font-medium
//                 text-[#FFD35A]
//               "
//                         >
//                             PROJECT CREATION
//                         </span>

//                         <h1 className="mt-5 text-3xl font-bold">
//                             Create a New Project
//                         </h1>

//                         <p className="mt-3 max-w-2xl text-[#EED8C7]">
//                             Define your project requirements, budget, category and
//                             deadline. You can manage freelancers, milestones and funding
//                             after the project is created.
//                         </p>
//                     </section>

//                     <form
//                         onSubmit={handleSubmit}
//                         className="
//               mt-8
//               rounded-3xl
//               border
//               border-[#E7DDD2]
//               bg-white
//               p-8
//             "
//                     >
//                         <div className="mb-8">
//                             <h2 className="text-2xl font-semibold text-[#3D2414]">
//                                 Project Details
//                             </h2>

//                             <p className="mt-2 text-sm text-[#B88746]">
//                                 Provide the basic information required to publish your
//                                 project.
//                             </p>
//                         </div>

//                         {error && (
//                             <div
//                                 className="
//                   mb-6
//                   rounded-2xl
//                   border
//                   border-red-200
//                   bg-red-50
//                   px-4
//                   py-3
//                   text-sm
//                   text-red-600
//                 "
//                             >
//                                 {error}
//                             </div>
//                         )}

//                         <div className="space-y-7">
//                             <div>
//                                 <label
//                                     htmlFor="title"
//                                     className="mb-2 block font-medium text-[#3D2414]"
//                                 >
//                                     Project Title
//                                 </label>

//                                 <div className="relative">
//                                     <BriefcaseBusiness
//                                         size={19}
//                                         className="
//                       absolute
//                       left-4
//                       top-1/2
//                       -translate-y-1/2
//                       text-[#B88746]
//                     "
//                                     />

//                                     <input
//                                         id="title"
//                                         name="title"
//                                         type="text"
//                                         value={formData.title}
//                                         onChange={handleChange}
//                                         placeholder="Example: E-Commerce Platform Rebuild"
//                                         required
//                                         maxLength={120}
//                                         className="
//                       w-full
//                       rounded-2xl
//                       border
//                       border-[#E7DDD2]
//                       py-3
//                       pl-12
//                       pr-4
//                       outline-none
//                       transition
//                       placeholder:text-[#B9A99A]
//                       focus:border-[#8B5A2B]
//                     "
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label
//                                     htmlFor="description"
//                                     className="mb-2 block font-medium text-[#3D2414]"
//                                 >
//                                     Project Description
//                                 </label>

//                                 <textarea
//                                     id="description"
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     placeholder="Describe the project requirements, expected outcome and important details."
//                                     required
//                                     maxLength={2000}
//                                     rows={7}
//                                     className="
//                     w-full
//                     resize-none
//                     rounded-2xl
//                     border
//                     border-[#E7DDD2]
//                     px-4
//                     py-3
//                     outline-none
//                     transition
//                     placeholder:text-[#B9A99A]
//                     focus:border-[#8B5A2B]
//                   "
//                                 />

//                                 <p className="mt-2 text-right text-xs text-[#B88746]">
//                                     {formData.description.length}/2000
//                                 </p>
//                             </div>

//                             <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//                                 <div>
//                                     <label
//                                         htmlFor="category"
//                                         className="mb-2 block font-medium text-[#3D2414]"
//                                     >
//                                         Category
//                                     </label>

//                                     <select
//                                         id="category"
//                                         name="category"
//                                         value={formData.category}
//                                         onChange={handleChange}
//                                         required
//                                         className="
//                       w-full
//                       rounded-2xl
//                       border
//                       border-[#E7DDD2]
//                       bg-white
//                       px-4
//                       py-3
//                       outline-none
//                       focus:border-[#8B5A2B]
//                     "
//                                     >
//                                         <option value="">
//                                             Select category
//                                         </option>

//                                         {categories.map((category) => (
//                                             <option key={category} value={category}>
//                                                 {category}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label
//                                         htmlFor="budget"
//                                         className="mb-2 block font-medium text-[#3D2414]"
//                                     >
//                                         Budget
//                                     </label>

//                                     <div className="relative">
//                                         <IndianRupee
//                                             size={18}
//                                             className="
//                         absolute
//                         left-4
//                         top-1/2
//                         -translate-y-1/2
//                         text-[#B88746]
//                       "
//                                         />

//                                         <input
//                                             id="budget"
//                                             name="budget"
//                                             type="number"
//                                             value={formData.budget}
//                                             onChange={handleChange}
//                                             placeholder="5000"
//                                             required
//                                             min="1"
//                                             step="1"
//                                             className="
//                         w-full
//                         rounded-2xl
//                         border
//                         border-[#E7DDD2]
//                         py-3
//                         pl-11
//                         pr-4
//                         outline-none
//                         focus:border-[#8B5A2B]
//                       "
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label
//                                         htmlFor="deadline"
//                                         className="mb-2 block font-medium text-[#3D2414]"
//                                     >
//                                         Deadline
//                                     </label>

//                                     <div className="relative">
//                                         <CalendarDays
//                                             size={18}
//                                             className="
//                         pointer-events-none
//                         absolute
//                         left-4
//                         top-1/2
//                         -translate-y-1/2
//                         text-[#B88746]
//                       "
//                                         />

//                                         <input
//                                             id="deadline"
//                                             name="deadline"
//                                             type="date"
//                                             min={today}
//                                             value={formData.deadline}
//                                             onChange={handleChange}
//                                             required
//                                             className="
//                         w-full
//                         rounded-2xl
//                         border
//                         border-[#E7DDD2]
//                         py-3
//                         pl-11
//                         pr-4
//                         outline-none
//                         focus:border-[#8B5A2B]
//                       "
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div
//                             className="
//                 mt-10
//                 flex
//                 items-center
//                 justify-end
//                 gap-3
//                 border-t
//                 border-[#E7DDD2]
//                 pt-6
//               "
//                         >
//                             <button
//                                 type="button"
//                                 disabled={submitting}
//                                 onClick={() => router.push("/client/projects")}
//                                 className="
//                   rounded-2xl
//                   border
//                   border-[#E7DDD2]
//                   px-6
//                   py-3
//                   font-medium
//                   text-[#8B5A2B]
//                   transition
//                   hover:bg-[#F8F4EF]
//                   disabled:cursor-not-allowed
//                   disabled:opacity-60
//                 "
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="
//                   flex
//                   min-w-44
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-2xl
//                   bg-[#8B5A2B]
//                   px-6
//                   py-3
//                   font-medium
//                   text-white
//                   transition
//                   hover:bg-[#6D4120]
//                   disabled:cursor-not-allowed
//                   disabled:opacity-60
//                 "
//                             >
//                                 {submitting ? (
//                                     <>
//                                         <Loader2
//                                             size={18}
//                                             className="animate-spin"
//                                         />
//                                         Creating...
//                                     </>
//                                 ) : (
//                                     "Create Project"
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </main>
//         </>
//     );
// }
import ClientSidebar from "@/components/client/ClientSidebar";
import ClientTopNav from "@/components/client/ClientTopNav";
import ProjectsForm from "@/components/client/project/ProjectsForm";

export default function CreateProjectPage() {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <ClientSidebar />

      <main className="flex-1">
        <ClientTopNav />

        <div className="p-8">
          <ProjectsForm />
        </div>
      </main>
    </div>
  );
}