import React from "react";
import { useDispatch } from "react-redux";
import { setTrade } from "../trade/tradeSlice";
import Button from "@material-ui/core/Button";

export default function ChartButton(props) {
  const dispatch = useDispatch();
  const loadChart = (trade) => {
    console.log(trade);
    window.loadChart(trade.trade.underlying);
    dispatch(setTrade(trade));
  };
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => loadChart(props.tradeItem)}
      aria-label="View"
    >
      View
    </Button>
  );
}
