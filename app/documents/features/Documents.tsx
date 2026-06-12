'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Document = {
  id: string;
  code: string;
  entityType: string;
  createdAt: string;
};

type ApiResponse = {
  data: Document[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

async function fetchDocuments(params: {
  page: number;
  pageSize: number;
  search: string;
  entityType: string;
}): Promise<ApiResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    search: params.search,
    entityType: params.entityType,
  });

  const res = await fetch(`http://localhost:3000/documents?${query}`);
  return res.json();
}

export const Documents = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [entityType, setEntityType] = useState('');

  const pageSize = 10;

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents', page, debouncedSearch, entityType],
    queryFn: () =>
      fetchDocuments({
        page,
        pageSize,
        search: debouncedSearch,
        entityType,
      }),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4">
        Documents
      </h1>

      {/* FILTER BAR */}
      <div className="flex gap-3 mb-4">

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search code..."
          className="border rounded px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ENTITY TYPE */}
        <select
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2 w-1/3"
        >
          <option value="">All Types</option>
          <option value="work_order">Work Order</option>
          <option value="contract">Contract</option>
          <option value="issue_note">Issue Note</option>
        </select>

      </div>

      {/* STATES */}
      {isLoading && (
        <div className="text-gray-500">Loading...</div>
      )}

      {isError && (
        <div className="text-red-500">Error loading data</div>
      )}

      {/* TABLE */}
      <div className="border rounded overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>

          <tbody>

            {data?.data?.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}

            {data?.data?.map((doc) => (
              <tr key={doc.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{doc.code}</td>
                <td className="p-3">{doc.entityType}</td>
                <td className="p-3 text-gray-600">
                  {new Date(doc.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        <div className="text-sm text-gray-600">
          Page <span className="font-medium">{page}</span> / {data?.meta?.totalPages ?? 1}
        </div>

        <button
          onClick={() =>
            setPage((p) =>
              data?.meta?.totalPages
                ? Math.min(p + 1, data.meta.totalPages)
                : p + 1
            )
          }
          disabled={page >= (data?.meta?.totalPages ?? 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>

      </div>

    </div>
  );
}