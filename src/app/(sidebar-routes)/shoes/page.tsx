import ToggleM from "@/components/ui/user/home/ToggleM";
import "@/styles/user/shoes.scss";
import { GiConverseShoe } from "react-icons/gi";

const page = () => {
  return (
    <main className="home">
      <section className="home1">
        <div>
          <GiConverseShoe style={{ color: "purple" }} />
          <p>Shoes</p>
        </div>
        <div>{/* <ToggleM /> */}</div>
      </section>
    </main>
  );
};

export default page;
