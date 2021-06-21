import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "../chart/Chart";
import Reddit from "../reddit/Reddit";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { trade: {} };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="root">
        <CssBaseline />
        <AppBar className="appBar">
          <Toolbar className="toolbar">
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className="title"
            >
              PM-TradersView
            </Typography>
          </Toolbar>
        </AppBar>
        <main className="content">
          <div className="appBarSpacer" />
          <Container maxWidth="lg" className="container">
            <Grid container spacing={2}>
              {/* Chart */}
              <Grid item xs={12} md={12} lg={12}>
                <Paper className="paper">
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Posts */}
              <Grid item xs={12}>
                <Paper className="paper">
                  <Reddit />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
    );
  }
}
export default Dashboard;
