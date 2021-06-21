import React from "react";
import { ResponsiveContainer } from "recharts";
import { Trade } from "../trade/Trade";
import Grid from "@material-ui/core/Grid";

export default function Chart() {
  return (
    <React.Fragment>
      <ResponsiveContainer>
        <div>
          <div className="tradingview-widget-container">
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} lg={7}>
                <div id="tradingview_7089e"></div>
              </Grid>
              <Grid item xs={1} md={4} lg={1}></Grid>
              <Grid item xs={10} md={4} lg={3}>
                <Trade />
              </Grid>
              <Grid item xs={1} md={4} lg={0}></Grid>
            </Grid>
          </div>
        </div>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
