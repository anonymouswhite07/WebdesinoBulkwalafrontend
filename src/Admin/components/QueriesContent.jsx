import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryStore } from "@/store/query.store";

export default function QueriesContent() {
  const { queries, fetchQueries, updateQueryStatus, loading, error } =
    useQueryStore();

  useEffect(() => {
    (async () => {
      const res = await fetchQueries();
      if (!res.success) toast.error(res.message);
    })();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateQueryStatus(id, newStatus);
    if (res.success) toast.success(`Query marked as ${newStatus}`);
    else toast.error(res.message);
  };

  if (loading)
    return (
      <p className="text-center py-8 text-gray-500">
        Loading customer queries...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 py-8">Error: {error}</p>;

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#02066F]">Customer Queries</CardTitle>
        <CardDescription>Manage user-submitted messages</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto p-0">
        {queries?.length > 0 ? (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q, i) => (
                <tr
                  key={q._id || i}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-sm font-medium">{q.name}</td>
                  <td className="p-3 text-sm text-gray-700">{q.email}</td>
                  <td className="p-3 text-sm text-gray-600 max-w-[300px] line-clamp-2">
                    {q.message}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        q.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : q.status === "read"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {q.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      {q.status !== "read" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleStatusChange(q._id, "read")}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {q.status !== "resolved" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleStatusChange(q._id, "resolved")}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            No queries found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
