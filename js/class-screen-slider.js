class ScreenSlider {
  constructor(wrapperID) {
    this.wrapperID = wrapperID;
    this.wrapper = document.getElementById(this.wrapperID);
    this.slider = this.wrapper.querySelector(".slider");
    this.handle = this.wrapper.querySelector(".handle");
    this.topLayer = this.wrapper.querySelector(".top");
    this.skew = 0;

    this.touchEvent;

    if (this.wrapper.firstElementChild.classList.contains("skewed") === true) {
      this.skew = 1000;
    }

    /**
     * When the element draggin stops
     */
    this.dragEnd = function(event) {
      document.removeEventListener("mouseup", this.onDragEndHandler);
      document.removeEventListener("mousemove", this.onDragHandler);

      document.removeEventListener("touchend", this.onDragEndHandler);
      document.removeEventListener("touchmove", this.onDragHandler);
    };

    this.onDragEndHandler = this.dragEnd.bind(this);

    /**
     * When the element is beign dragged
     */
    this.drag = function(event) {
      if (event.type === "touchmove") {
        this.slider.style.left = event.touches[0].clientX + "px";
        this.topLayer.style.width = event.touches[0].clientX + this.skew + "px";
      } else {
        this.slider.style.left = event.clientX + "px";
        this.topLayer.style.width = event.clientX + this.skew + "px";
      }
    };

    this.onDragHandler = this.drag.bind(this);

    this.handle.addEventListener("mousedown", event => {
      event.preventDefault();

      document.addEventListener("mouseup", this.onDragEndHandler);
      document.addEventListener("mousemove", this.onDragHandler);
      this.handle.addEventListener("dragstart", event =>
        event.preventDefault()
      );
    });

    this.handle.addEventListener("touchstart", event => {
      event.preventDefault();

      document.addEventListener("touchend", this.onDragEndHandler);
      document.addEventListener("touchmove", this.onDragHandler);
    });
  }

  checkInsideViewPort() {
    let handleBoundaries = this.handle.getBoundingClientRect();
    console.log(handleBoundaries.left, handleBoundaries.right);
    if (
      handleBoundaries.left >= 0 &&
      handleBoundaries.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    ) {
      return true; //Inside the viewport
    } else if (handleBoundaries.left <= 0) return "left";
    else if (
      handleBoundaries.right <=
      (window.innerWidth || document.documentElement.clientWidth)
    ) {
      return "rigth";
    }
  }
}
