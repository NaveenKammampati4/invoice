import React from "react";

const Item = (props) => {
  const { each } = props;
  return (
    <tr className="text-slate-900 font-light">
      <th className="px-4 py-2 text-left">{each.description}</th>
      <th className="px-4 py-2">{each.quantity}</th>
      <th className="px-4 py-2">{each.unitPrice}</th>
      <th className="px-4 py-2">{each.totalPrice}</th>
    </tr>
  );
};

export default Item;
