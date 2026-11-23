import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, InputField } from "../../../components";
import PaymentMethods from "../components/PaymentMethods";
import { PaymentFormValidation } from "../hooks/usePayment";

type PaymentOption = "card" | "bank";

const PAYMENT_METHODS = [
  {
    label: "Credit or Debit Card",
    value: "card",
  },
  {
    label: "Bank Transfer",
    value: "bank",
  },
];
const Payment = () => {
  const { userId } = useParams();
  // const { userDatas } = GetUsers();
  const { register, handleSubmit, formState } = PaymentFormValidation();
  const Navigate = useNavigate();
  const [selected, setSelected] = useState<PaymentOption>("card");

  // const user = userDatas.find((u) => u.id === userId);

  const onSubmit = handleSubmit(() => {
    Navigate(`/user/${userId}/ticket`);
    // if (user) {
    // localStorage.setItem("selectedUserId", String(user.id));
    // }
    // Navigate("/ticket");
  });

  // if (!user) return <div>error</div>;

  return (
    <main className="flex gap-5 items-center justify-center h-screen">
      <form onSubmit={onSubmit}>
        <div className="flex-col gap-4 p-5 w-auto">
          <div className="flex justify-center gap-4">
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethods
                key={method.value}
                label={method.label}
                value={method.value}
                selected={selected === method.value}
                onSelect={(val) => setSelected(val as PaymentOption)}
              />
            ))}
          </div>
          <InputField
            labelName="Cardholder's Name"
            error={formState.errors.nameOnCard?.message}
            required
            {...register("nameOnCard")}
          />
          <InputField
            labelName="Card Number"
            error={formState.errors.cardNumber?.message}
            required
            {...register("cardNumber")}
          />
          <InputField
            labelName="CVV"
            error={formState.errors.cvv?.message}
            required
            {...register("cvv")}
          />
          <InputField
            labelName="EXPIRY"
            error={formState.errors.validTHRU?.message}
            required
            {...register("validTHRU")}
          />

          <Button onClick={onSubmit} type="submit" label="Bayar Sekarang" />
        </div>
      </form>
    </main>
  );
};

export default Payment;
