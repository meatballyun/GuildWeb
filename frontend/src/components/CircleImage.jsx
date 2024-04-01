import { classNames } from "../utils";

export const CircleImage = ({ className, size, url }) => {
  return (
    <div
      className={classNames(
        "flex-shrink-0 rounded-full bg-primary-200",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundImage: url && `url("${url}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
};
