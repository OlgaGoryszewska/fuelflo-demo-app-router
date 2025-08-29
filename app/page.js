export default function Home() {
  return (
    <div>
      <img src="/main.png" alt="main page image" className="pb-4 " />
      <div className="m-4 flex flex-col justify-center items-center ">
      <h2 className="text-4xl text-center">Welcome to Fuelflo </h2>
      <p className="body-text">
        For best experience access your dashboard and manage your fuel operations with confidence.
        We are here to support your success—every step of the way.
      </p>
      <button >
        <a href="/signIn" >Sign In</a>
      </button>
      </div>
    </div>
  );
}
