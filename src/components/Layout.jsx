import Navbar from "./Navbar"



export default function Layout({ children }){
    

    return(
       <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-1 md:ml-64 p-4">{children}</main>
    </div>
    );
}