/**
 * AdminPage
 * TODO add error handling display
 */
"use client";

import { handleCreateProblem } from "app/admin/actions";

export default function AdminPage() {
  return (
    <form
      className="
      align-center
      bg-primary-content
      flex
      flex-col
      items-center
      justify-around
      w-full
      h-[calc(100dvh-64px)]
      "
      action={handleCreateProblem}
    >
      <div>
        <label htmlFor="slug">slug</label>
				<p>{`e.g. something-like-this`}</p>
        <input
          className="input input-bordered w-full max-w-lg"
          type="text"
          id="slug"
          name="slug"
          required
        />
      </div>
      <div>
        <label htmlFor="title">Title</label>
        <input
          className="input input-bordered w-full max-w-lg"
          type="text"
          id="title"
          name="title"
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          className="textarea textarea-bordered textarea-sm w-full max-w-lg"
          id="description"
          name="description"
          required
        />
      </div>
      <div>
        <label htmlFor="starterCode">Starter Code</label>
        <textarea
          className="textarea textarea-bordered textarea-sm w-full max-w-lg"
          id="starterCode"
          name="starterCode"
          required
        />
      </div>
      <div>
        <label htmlFor="testCode">Test Code</label>
        <textarea
          className="textarea textarea-bordered textarea-sm w-full max-w-lg"
          id="testCode"
          name="testCode"
        />
      </div>
      <div>
        <label htmlFor="topic">Topic</label>
        <input
          className="input input-bordered w-full max-w-lg"
          type="text"
          id="topic"
          name="topic"
        />
      </div>
      <button className="btn btn-primary" type="submit">
        Create Problem
      </button>
    </form>
  );
}
