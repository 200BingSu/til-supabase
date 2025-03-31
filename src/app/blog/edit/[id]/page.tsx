"use client";
import { BlogsRow, getBlogId } from "@/app/actions/blog-action";
import EditEditor from "@/components/editor/edit-editor";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogsRow>();
  const fetchGetBlogId = async (_id: string) => {
    const { data, error, status } = await getBlogId(Number(_id));
    console.log("data", data);
    if (data) {
      setBlog(data);
    }
  };
  useEffect(() => {
    fetchGetBlogId(id as string);
  }, []);
  return (
    <div className="w-[920px] h-screen bg-[#f9f9f9] border-r border-[#d6d6d6] flex items-start justify-center">
      {blog && <EditEditor blog={blog} />}
    </div>
  );
}

export default Page;
