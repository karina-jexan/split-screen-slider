class ScreenSlider {
  constructor(wrapperID) {
    /**
     * Initialize elements
     */
    this.wrapperID = wrapperID;
    this.wrapper = document.getElementById(this.wrapperID);
    this.slider = this.wrapper.querySelector(".slider");
    this.handle = this.wrapper.querySelector(".handle");
    this.topLayer = this.wrapper.querySelector(".top");
    this.bottomText = this.wrapper.querySelector(".bottom-text");
    this.skew = 0;
    this.touchEvent;

    if (this.wrapper.firstElementChild.classList.contains("skewed") === true) {
      this.skew = 1000;
    }

    /**
     * Event listeners for mouse and touch actions
     */
    this.handle.addEventListener("mousedown", event => {
      event.preventDefault();
      // Remove CSS animation class from slider and top layer
      this.removeAnimation();

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

    /**
     * Functions to handle the slider.
     * drag - handles when the element is beign dragged
     * dragEnd- when the dragging stops
     */

    this.drag = function(event) {
      this.updateOpacity(event);
      if (event.type === "touchmove") {
        this.slider.style.left = event.touches[0].clientX + "px";
        this.topLayer.style.width = event.touches[0].clientX + this.skew + "px";
      } else {
        this.slider.style.left = event.clientX + "px";
        this.topLayer.style.width = event.clientX + this.skew + "px";
      }
    };

    this.dragEnd = function(event) {
      document.removeEventListener("mouseup", this.onDragEndHandler);
      document.removeEventListener("mousemove", this.onDragHandler);

      document.removeEventListener("touchend", this.onDragEndHandler);
      document.removeEventListener("touchmove", this.onDragHandler);
    };

    /**
     * Handlers - The reference of the functions sent to the eventListeners
     * is stored in a property to be used later on in the removeEventListeners
     */
    this.onDragEndHandler = this.dragEnd.bind(this);
    this.onDragHandler = this.drag.bind(this);
  }

  checkInsideViewPort() {
    let handleBoundaries = this.handle.getBoundingClientRect();
    console.log(event);
    console.log(event.x, event.y);
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

  removeAnimation() {
    this.slider.classList.remove("slider-animation");
    this.topLayer.classList.remove("top-layer-animation");
  }

  updateOpacity(event) {
    let positionX = event.pageX;
    let positionY = event.pageY;
    let windowWidth = window.innerWidth;
    let elementStyle = getComputedStyle(this.handle);
    let delta;
    let newOpacity;

    delta = (windowWidth - positionX) / windowWidth;
    newOpacity = delta - 0.5;
    this.bottomText.style.opacity = delta;
  }
}
