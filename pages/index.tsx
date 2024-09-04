import UserTable from "@/components/UserTable";



export default function Home() {
  return (
    <>
      <div className="m-2">
        <h1 className="text-4xl font-bold text-center">
          <span className="bg-[#BE9F56] text-black">Users</span>
          <span className="ps-2">Table</span>
        </h1>
      </div>
      <UserTable />
    </>
  );
}
