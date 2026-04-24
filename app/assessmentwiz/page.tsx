export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Company Assessment</h2>
          <p className="text-gray-400">Let's get to know your company</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 text-sm">Step 1 of 4</p>
          <h3 className="text-xl font-semibold">What's your company name?</h3>
          <input
            type="text"
            placeholder=" "
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-gray-500"
          />
          <button className="w-full bg-white text-gray-950 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all duration-200">
            Continue →
          </button>
        </div>
      </div>
    </main>
  );
}