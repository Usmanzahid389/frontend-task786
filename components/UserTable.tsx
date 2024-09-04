import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";

type User = {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  id: {
    name: string;
    value: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
};

type ResponseData = {
  results: User[];
  info: {
    page: number;
    results: number;
  };
};

const fetchAllUsers = async (seed: string) => {
  const response = await fetch(
    `https://randomuser.me/api/?page=1&results=100&seed=${seed}`
  );
  const data: ResponseData = await response.json();
  return data;
};

const fetchUsers = async (page: number, seed: string) => {
  const response = await fetch(
    `https://randomuser.me/api/?page=${page}&results=10&seed=${seed}`
  );
  const data: ResponseData = await response.json();
  return data;
};

const exactMatchFilterFn: FilterFn<User> = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  return rowValue === filterValue;
};

const UserTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<User[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [seed, setSeed] = useState<string>("abc");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const router = useRouter();

  useEffect(() => {
    // Initialize filter and pagination state from local storage
    const storedCurrentPage = localStorage.getItem("currentPage");
    const storedGenderFilter = localStorage.getItem("genderFilter");
    const storedColumnFilters = localStorage.getItem("columnFilters");
    const storedFilteredData = localStorage.getItem("filteredData");

    if (storedCurrentPage) {
      setCurrentPage(parseInt(storedCurrentPage, 10));
    }
    if (storedGenderFilter) {
      setGenderFilter(storedGenderFilter);
    }
    if (storedColumnFilters) {
      setColumnFilters(JSON.parse(storedColumnFilters));
    }

    if (storedFilteredData) {
      setData(JSON.parse(storedFilteredData));
      return; // Skip API fetch if data is found in local storage
    }

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const result = await fetchAllUsers(seed);
        setTotalResults(result.info.results);
        setTotalPages(Math.ceil(result.info.results / 10)); // Calculate total pages

        // Initially load the first page of data with applied filters
        const firstPageResult = await fetchUsers(1, seed);
        setData(applyFilters(firstPageResult.results));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [seed]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchUsers(currentPage, seed);
        const filteredData = applyFilters(result.results);
        setData(filteredData);
        localStorage.setItem("filteredData", JSON.stringify(filteredData));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentPage <= totalPages) {
      loadData();
    }
  }, [currentPage, seed, totalPages, genderFilter]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("genderFilter", genderFilter);
  }, [genderFilter]);

  useEffect(() => {
    localStorage.setItem("columnFilters", JSON.stringify(columnFilters));
  }, [columnFilters]);

  const applyFilters = (data: User[]) => {
    let filteredData = data;
    if (genderFilter) {
      filteredData = filteredData.filter(
        (user) => user.gender === genderFilter
      );
    }
    return filteredData;
  };


  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "Picture",
        accessorFn: (row) => row.picture.large,
        cell: (info) => (
          <img
            src={info.getValue() as string}
            alt="user"
            className="w-12 h-12 rounded-full cursor-pointer"
            title="Click to view larger"
          />
        ),
      },
      {
        header: "Name",
        accessorFn: (row) =>
          `${row.name.title} ${row.name.first} ${row.name.last}`,
      },
      {
        header: "Gender",
        accessorKey: "gender",
        filterFn: exactMatchFilterFn,
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Username",
        accessorKey: "login.username",
      },
      {
        header: "Date of Birth",
        accessorKey: "dob.date",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString();
        },
      },
      {
        header: "Age",
        accessorKey: "dob.age",
      },
      {
        header: "Phone",
        accessorKey: "phone",
      },
      {
        header: "Cell",
        accessorKey: "cell",
      },
      {
        header: "ID",
        accessorFn: (row) => `${row.id.name}: ${row.id.value}`,
      },
      {
        header: "Registration Date",
        accessorKey: "registered.date",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString();
        },
      },
      {
        header: "Location",
        accessorFn: (row) =>
          `${row.location.street.number} ${row.location.street.name}, ${row.location.city}, ${row.location.state}, ${row.location.country}, ${row.location.postcode}`,
      },
      {
        header: "Coordinates",
        accessorFn: (row) =>
          `Lat: ${row.location.coordinates.latitude}, Long: ${row.location.coordinates.longitude}`,
      },
      {
        header: "Timezone",
        accessorFn: (row) =>
          `${row.location.timezone.offset} - ${row.location.timezone.description}`,
      },
      {
        header: "Nationality",
        accessorKey: "nat",
      },
      {
        header: "View",
        id: "actions",
        cell: (info) => {
          const user = info.row.original;

          return (
            <button
              onClick={() => {
                localStorage.setItem("selectedUser", JSON.stringify(user));
                router.push(`/profile/${user.login.uuid}`);
              }}
              className="px-2 py-1 bg-[#BE9F56] text-white rounded hover:bg-[#a06e35]"
              title="View Profile"
            >
              View
            </button>
          );
        },
      },
    ],
    [router]
  );

 const table = useReactTable({
   data,
   columns,
   getCoreRowModel: getCoreRowModel(),
   getPaginationRowModel: getPaginationRowModel(),
   getFilteredRowModel: getFilteredRowModel(),
   state: {
     globalFilter,
     columnFilters,
   },
   onGlobalFilterChange: setGlobalFilter,
   onColumnFiltersChange: setColumnFilters,
   manualPagination: true,
   pageCount: Math.ceil(totalResults / 10),
 });

 const handlePageChange = (page: number) => {
   if (page < 1 || page > table.getPageCount()) return;
   setCurrentPage(page);
 };
  const handleGenderFilterChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newGenderFilter = event.target.value;
    setGenderFilter(newGenderFilter);
    setLoading(true);
    try {
      const result = await fetchAllUsers(seed); 
      const filteredData = applyFilters(result.results);
      setData(filteredData);
      localStorage.setItem("filteredData", JSON.stringify(filteredData));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

 const getRowClassName = (index: number) =>
   index % 2 === 0 ? "bg-gray-100" : "bg-white";

 return (
   <div className="p-4 max-w-screen-xl mx-auto">
     <div className="mb-2">
       <select
         value={genderFilter}
         onChange={handleGenderFilterChange}
         className="ml-4 p-2 border border-gray-300 rounded"
       >
         <option value="">All Genders</option>
         <option value="female">Male</option>
         <option value="male">Female</option>
       </select>
     </div>

     {loading ? (
       <div className="TableScroll overflow-x-auto overflow-y-auto max-h-[80vh]">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-black text-[#BE9F56] text-nowrap sticky h-16 top-0 z-10">
             {table.getHeaderGroups().map((headerGroup) => (
               <tr key={headerGroup.id}>
                 {headerGroup.headers.map((header) => (
                   <th key={header.id} className="p-2">
                     {header.column.columnDef.header !== null &&
                     !header.isPlaceholder ? (
                       <>
                         {flexRender(
                           header.column.columnDef.header,
                           header.getContext()
                         )}
                         {!["Picture", "actions"].includes(header.id) && (
                           <input
                             type="text"
                             value={
                               (table
                                 .getColumn(header.id)
                                 ?.getFilterValue() as string) || ""
                             }
                             onChange={(e) =>
                               table
                                 .getColumn(header.id)
                                 ?.setFilterValue(e.target.value)
                             }
                             placeholder={`Filter ${header.column.columnDef.header}`}
                             className="ml-2 p-1 border border-gray-300 rounded"
                           />
                         )}
                       </>
                     ) : null}
                   </th>
                 ))}
               </tr>
             ))}
           </thead>
           <tbody className="divide-y divide-gray-200 text-sm text-[#737373] text-nowrap">
             {[...Array(10).keys()].map((index) => (
               <tr key={index} className={getRowClassName(index)}>
                 {columns.map((column) => (
                   <td key={column.id} className="p-2">
                     <Skeleton width={100} height={20} />
                   </td>
                 ))}
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     ) : (
       <>
         <div className="TableScroll overflow-x-auto overflow-y-auto max-h-[80vh]">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-black text-[#BE9F56] text-nowrap sticky h-16 top-0 z-10">
               {table.getHeaderGroups().map((headerGroup) => (
                 <tr key={headerGroup.id}>
                   {headerGroup.headers.map((header) => (
                     <th key={header.id} className="p-2">
                       {header.isPlaceholder ? null : (
                         <>
                           {flexRender(
                             header.column.columnDef.header,
                             header.getContext()
                           )}
                           {/* Render filter input only if column is filterable */}
                           {!["Picture", "actions"].includes(header.id) && (
                             <input
                               type="text"
                               value={
                                 (table
                                   .getColumn(header.id)
                                   ?.getFilterValue() as string) || ""
                               }
                               onChange={(e) =>
                                 table
                                   .getColumn(header.id)
                                   ?.setFilterValue(e.target.value)
                               }
                               placeholder={`Filter ${header.column.columnDef.header}`}
                               className="ml-2 p-1 border border-gray-300 rounded"
                             />
                           )}
                         </>
                       )}
                     </th>
                   ))}
                 </tr>
               ))}
             </thead>
             <tbody className="divide-y divide-gray-200 text-sm text-[#737373] text-nowrap">
               {table.getRowModel().rows.map((row, index) => (
                 <tr key={row.id} className={getRowClassName(index)}>
                   {row.getVisibleCells().map((cell) => (
                     <td key={cell.id} className="p-2">
                       {flexRender(
                         cell.column.columnDef.cell,
                         cell.getContext()
                       )}
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         <div className="flex justify-between items-center mt-4">
           <button
             onClick={() => handlePageChange(currentPage - 1)}
             disabled={currentPage === 1}
             className="p-2 bg-[#BE9F56] text-white rounded"
           >
             Previous
           </button>
           <span>
             Page {currentPage} of {totalPages}
           </span>
           <button
             onClick={() => handlePageChange(currentPage + 1)}
             disabled={currentPage === totalPages}
             className="p-2 bg-[#BE9F56] text-white rounded"
           >
             Next
           </button>
         </div>
       </>
     )}
   </div>
 );
};

export default UserTable;
