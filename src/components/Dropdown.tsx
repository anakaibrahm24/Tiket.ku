import { UseFormRegisterReturn } from "react-hook-form";

interface DropDownProps {
  labelName: string;
  defaultValue?: number;
  options: { value: string | number; label: string }[];
  register: UseFormRegisterReturn;
  errorMessage?: string;
}

export const Dropdown: React.FC<DropDownProps> = ({
  labelName,
  defaultValue,
  options,
  register,
  errorMessage,
}) => {
  return (
    <div>
      <label className="text-base mb-2 text-ink-700">
        {labelName}

        <select
          className={`w-full p-2.5 mt-2 mb-[5px] border rounded-xl text-base focus:outline-none focus:border-primary ${
            errorMessage
              ? "border-danger focus:border-danger"
              : "border-border"
          }`}
          {...register}
          defaultValue={defaultValue || ""}
        >
          <option value="" disabled>
            -- Please select an option --
          </option>
          {options.map((option, index) => {
            return (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
        {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}
      </label>
    </div>
  );
};
