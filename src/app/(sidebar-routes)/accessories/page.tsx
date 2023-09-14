import ToggleM from "@/components/ui/user/home/ToggleM";
import "@/styles/user/accessories.scss";
import { BsHandbagFill } from "react-icons/bs";

const page = () => {
  return (
    <main className="home">
      <section className="home1">
        <div>
          <BsHandbagFill style={{ color: "#AA7D61" }} />
          <p>Accessories</p>
        </div>
        <div>{/* <ToggleM /> */}</div>
      </section>
    </main>
  );
};

export default page;
