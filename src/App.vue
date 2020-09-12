<template id=page>
  <div id="app">
    <button id="returnButton" v-on:click="repoulateDate">Return</button>
    <h1 id="title">Vehicles avaliable for hire</h1>
    <h3 id="select">Select a vehicle to view it in more details and enquire about hire cost</h3>
    <table id="table">
      <thead>
        <tr id="tpRow">
          <th>Vehicle Registration</th>
          <th>Vehicle Type</th>
          <th>Make</th>
          <th>Model</th>
          <th>Fuel Type</th>
          <th>Hired</th>
          <th>Customer Name</th>
          <th>Price per day</th>
        </tr>
      </thead>
      <tbody>
        <tr
          id="hvrRow"
          v-for="vehicle in vehicles"
          :key="vehicle.registration"
          v-on:click="clickList(vehicle)"
        >
          <td id="reg">{{vehicle.registration}}</td>
          <td>{{vehicle.vehicleType}}</td>
          <td>{{vehicle.make}}</td>
          <td>{{vehicle.model}}</td>
          <td>{{vehicle.fuelType}}</td>
          <td>{{vehicle.hired}}</td>
          <td>{{vehicle.customerName}}</td>
          <td>{{vehicle.price}}</td>
        </tr>
      </tbody>
    </table>
    <div id="showHiredBtn">
      <button id="buttonhire" v-on:click="showHired()">Show Hired Vehicles</button>
    </div>
    <div id="datepickers">
      <div id="strDateDiv">
        <h2>Pick a start date</h2>
        <div>
          <datetime v-model="selectedDateStart" format="dd-MM-yyyy"></datetime>
        </div>
      </div>
      <div id="endDateDiv">
        <h2>Pick a end date</h2>
        <datetime v-model="selectedDateEnd" format="dd-MM-yyyy"></datetime>
      </div>
      <div id="hirebtn">
        <button
          id="buttonhire"
          v-on:click="calcCostGetCall(selectedDateStart,selectedDateEnd,vehicles[0].registration)"
        >Calculate Hire Price</button>
        <h1 id="tltPrice">Total Hire Price:£{{costperday}}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Datetime } from "vue-datetime";
import Vue from "vue";
Vue.use(Datetime);
export default {
  name: "App",
  components: { datetime: Datetime },

  data() {
    return {
      vehicles: [],
      tempVeh: [],
      costperday: null,
      selectedDateEnd: null,
      selectedDateStart: null,
    };
  },
  async created() {
    try {
      const res = await axios.get(`http://localhost:8080/vehicles/available`);
      this.vehicles = res.data;
      this.tempVeh = res.data;
      console.log(this.vehicles);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async repoulateDate() {
      const res = await axios.get(`http://localhost:8080/vehicles/available`);
      this.vehicles = res.data;
      document.getElementById("datepickers").style.visibility = "hidden";
      document.getElementById("tltPrice").style.visibility = "hidden";
      document.getElementById("showHiredBtn").style.visibility = "visible";
      document.getElementById("title").innerHTML =
        "Vehicles avaliable for hire";
    },
    clickList: function (vehicle) {
      for (let index = 0; index < this.vehicles.length; index++) {
        if (this.vehicles[index].registration != vehicle.registration) {
          this.vehicles.splice(index, 1);
          index--;
        }
        document.getElementById("title").innerHTML =
          vehicle.make + " " + vehicle.model + " " + vehicle.registration;
      }
      document.getElementById("datepickers").style.visibility = "visible";
      document.getElementById("showHiredBtn").style.visibility = "hidden";
    },
    async showHired() {
      const res = await axios.get(`http://localhost:8080/vehicles`);
      this.vehicles = res.data;
      document.getElementById("showHiredBtn").style.visibility = "hidden";
      document.getElementById("title").innerHTML = "All Vehicles";
    },
    async calcCostGetCall(startdate, enddate, reg) {
      var startDateRmvTime = startdate.split("T")[0];
      var EndDateAPIRmvTime = enddate.split("T")[0];
      var splitdate = startDateRmvTime.split("-");
      var splitdateEnd = EndDateAPIRmvTime.split("-");
      splitdate.reverse();
      splitdateEnd.reverse();
      splitdate[0] = splitdate[0] + "-";
      splitdate[1] = splitdate[1] + "-";
      splitdateEnd[0] = splitdateEnd[0] + "-";
      splitdateEnd[1] = splitdateEnd[1] + "-";
      var startDateApi = splitdate[0] + splitdate[1] + splitdate[2];
      var EndDateAPI = splitdateEnd[0] + splitdateEnd[1] + splitdateEnd[2];

      var url =
        `http://localhost:8080/vehicle/calculateCost/` +
        reg +
        `/` +
        startDateApi +
        `/` +
        EndDateAPI;
      await axios.get(url).then((response) => {
        const data = response.data;
        this.costperday = data;
      });
      document.getElementById("tltPrice").style.visibility = "visible";
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#table {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white;
  background: #2c3e50;
  text-align: left;
  border: #3a5570;
  width: 100%;
  padding-top: 10%;
}

td {
  border: 1px solid white;
}
table {
  border-collapse: collapse;
}
#title {
  color: #2c3e50;
}
#reg {
  color: yellow;
}
#buttonhire {
  color: white;
  background-color: #2c3e50;
  width: 100px;
  height: 50px;
}
#returnButton {
  color: white;
  background-color: #2c3e50;
  width: 100px;
  height: 50px;
  float: right;
}
#strDateDiv {
  float: left;
  padding-left: 40%;
}
#endDateDiv {
  float: right;
  padding-right: 40%;
}
#hvrRow:hover {
  background-color: #6c7d8f;
}
#datepickers {
  visibility: hidden;
  align-self: left;
}
#hirebtn {
  align-self: center;
  padding-top: 100px;
  float: bottom;
}
#tltPrice {
  visibility: hidden;
}
#select {
  float: left;
}
</style>
