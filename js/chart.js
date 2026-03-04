// chart.js
const ctx = document.getElementById("myChart");

let myChart; // store chart instance

function buildChart(completed, pending) {
  myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ["#6366F1", "#F43F5E"],
        borderWidth: 0,
        hoverOffset: 5,
        spacing: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: window.innerWidth >= 1024 ? "top" : "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 14,
            font: { size: 12, weight: "600" }
          }
        }
      }
    }
  });
}

function updateChart(completed, pending) {
  if (!myChart) {
    buildChart(completed, pending);
    return;
  }
  myChart.data.datasets[0].data = [completed, pending];
  myChart.update();
}

// ✅ Listen for updates from dashboard.js
window.addEventListener("tasksUpdated", (e) => {
  const { completed, pending } = e.detail;
  updateChart(completed, pending);
});

// ✅ Optional: update legend position on resize
window.addEventListener("resize", () => {
  if (!myChart) return;
  myChart.options.plugins.legend.position =
    window.innerWidth >= 1024 ? "top" : "bottom";
  myChart.update();
});

// ✅ Initial load from localStorage (so chart shows on refresh)
window.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;

  updateChart(completed, pending);
});