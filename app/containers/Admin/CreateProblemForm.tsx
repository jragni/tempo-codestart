/**
 * CreateProblemForm
 */
"use client";
import { handleCreateProblem } from "@/app/admin/actions";

export default function CreateProblemForm() {
  return (
    <div className="font-serif">
      <h1 className=" text-xl bold">Create Problem Form</h1>
      <form action={handleCreateProblem}>
        <div>
          <label htmlFor="slug">Slug</label>
          <p className="text-sm">example: something-like-this</p>
          <input
            className="input input-bordered w-full max-w-lg"
            name="slug"
            required
          />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            className="input input-bordered w-full max-w-lg"
            name="title"
            required
          />
        </div>
        <div>
          <label htmlFor="description">description</label>
          <textarea
            className="input input-bordered w-full max-w-lg"
            name="description"
            required
          />
        </div>
        <div>
          <label htmlFor="starterCode">Starter Code</label>
          <textarea
            className="input input-bordered w-full max-w-lg"
            name="starterCode"
            required
          />
        </div>
        <label htmlFor="testCode">Test Code</label>
        <textarea
          className="input input-bordered w-full max-w-lg"
          name="testCode"
        />
        <div>
          <label htmlFor="solution">Solution</label>
          <textarea
            className="input input-bordered w-full max-w-lg"
            name="solution"
          />
        </div>
        <div>
          <label htmlFor="topic">Topic</label>
          <input
            className="input input-bordered w-full max-w-lg"
            name="topic"
          />
        </div>
        <button className="btn btn-primary" type="submit">
					Create Problem
        </button>
      </form>
    </div>
  );
}
