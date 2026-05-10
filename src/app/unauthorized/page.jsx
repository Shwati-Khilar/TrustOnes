export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-red-600">
          Unauthorized
        </h1>

        <p className="mt-3 text-slate-600">
          You are logged in, but you do not have permission to access this page.
        </p>
      </div>
    </main>
  );
}