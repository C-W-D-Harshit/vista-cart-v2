// import ToggleM from "@/components/ui/user/home/ToggleM";
import "@/styles/user/inspiration.scss";
import { IoDiamondSharp } from "react-icons/io5";

const page = () => {
  return (
    <main className="home">
      <section className="home1">
        <div>
          <IoDiamondSharp style={{ color: "aqua" }} />
          <p>Inspiration</p>
        </div>
        <div>{/* <ToggleM /> */}</div>
      </section>
    </main>
  );
};

export default page;
