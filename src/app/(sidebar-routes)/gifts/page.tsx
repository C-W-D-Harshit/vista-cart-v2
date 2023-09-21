// import ToggleM from "@/components/ui/user/home/ToggleM";
import "@/styles/user/gifts.scss";
import { AiFillGift } from "react-icons/ai";

const page = () => {
  return (
    <main className="home">
      <section className="home1">
        <div>
          <AiFillGift style={{ color: "red" }} />
          <p>Gifts</p>
        </div>
        <div>{/* <ToggleM /> */}</div>
      </section>
    </main>
  );
};

export default page;
