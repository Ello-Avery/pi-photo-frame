import "./About.css";
import { Modal } from "../Modal/Modal";
import { useSettingStore } from "../../store/SettingStore";

// TODO: wire this up to the currently displayed photo. Frame already has the
// data — `Photo.name` and `Photo.takenAt` — sourced from api/images.ts; it
// just needs to be passed down once the real content is designed.
export const About = () => {
  const { closeAbout } = useSettingStore();

  return (
    <Modal title="About this image" onClose={closeAbout}>
      <p className="about-body">Photo details coming soon.</p>
    </Modal>
  );
};
