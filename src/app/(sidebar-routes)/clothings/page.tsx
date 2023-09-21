// import ToggleM from "@/components/ui/user/home/ToggleM";
import "@/styles/user/clothings.scss";
import { GiClothes } from "react-icons/gi";

const page = () => {
  return (
    <main className="home">
      <section className="home1">
        <div>
          <GiClothes style={{ color: "#C09443" }} />
          <p>Clothings</p>
        </div>
        <div>{/* <ToggleM /> */}</div>
      </section>
    </main>
  );
};

export default page;
