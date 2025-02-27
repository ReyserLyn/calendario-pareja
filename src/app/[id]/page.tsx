"use client";

import { useParams } from "next/navigation";

export default function AlbumSessionPage() {
  const params = useParams();
  const id = params.id as string;

  // Now you can use this id for database calls later
  return (
    <div>
      <h1>Album Session Page</h1>
      <p>Album ID: {id}</p>
      {/* You can add your database fetching logic here using the id */}
    </div>
  );
}
