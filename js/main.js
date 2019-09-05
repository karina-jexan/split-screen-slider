document.addEventListener("DOMContentLoaded", () => {
  let wrapper = document.getElementById("wrapper-1");
  let slider = document.querySelector(".handle");
  let circle = document.querySelector(".circle");
  let topLayer = wrapper.querySelector(".top");
  let handle = wrapper.querySelector(".handle");
  let skew = 0;
  let delta = 0;
  let mouseX = 0;
  let mouseY = 0;

  if (wrapper.firstElementChild.classList.contains("skewed") === true) {
    skew = 1000;
  }

  circle.onmousedown = function(event) {
    event.preventDefault(); // prevent selection start (browser action)

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(event) {
      delta = (event.clientX - window.innerWidth / 2) * 0.5;
      handle.style.left = event.clientX + "px";
      topLayer.style.width = event.clientX + skew + "px";
    }

    function onMouseUp(event) {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  circle.ondragstart = function(event) {
    event.preventDefault();
  };
});
