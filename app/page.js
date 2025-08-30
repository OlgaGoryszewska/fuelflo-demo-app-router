export default function Home() {
  return (
    <div>
      <img src="/main.png" alt="main page image" className="pb-4 " />
      <div className="m-4 flex flex-col justify-center items-center ">
        <h2 className="text-4xl text-center">Welcome to Fuelflo </h2>
        <p className="body-text">
          For best experience access your dashboard and manage your fuel
          operations with confidence. 
        </p>
        <button>
          <a href="/signIn">Sign In</a>
        </button>
        <p className="body-text pt-4 border-t border-dashed border-s-cyan-700">We are here to support your success—every
        step of the way.</p>
        <img src="/hello-blob.png" alt="main page image" className="pb-4 " />
      </div>
    </div>
  );
}
