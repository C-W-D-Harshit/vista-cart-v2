import ToggleM from "@/components/ui/user/home/ToggleM";
import "@/styles/user/activewear.scss";
import { MdSportsGymnastics } from "react-icons/md";

const page = () => {
  return (
    <main className="home">
      <section className="home1">
        <div>
          <MdSportsGymnastics style={{ color: "#F8CADA" }} />
          <p>Activewear</p>
        </div>
        <div>{/* <ToggleM /> */}</div>
      </section>
    </main>
  );
};

export default page;
