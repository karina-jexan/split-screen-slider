class ScreenSlider {
  constructor(wrapperID, click = false) {
    /**
     * Initialize elements
     */
    this.wrapperID = wrapperID;
    this.wrapper = document.getElementById(this.wrapperID);
    this.slider = this.wrapper.querySelector(".slider");
    this.handle = this.wrapper.querySelector(".handle");
    this.topLayer = this.wrapper.querySelector(".top");
    this.bottomContainer = this.wrapper.querySelector(".bottom .content-body");
    this.topContainer = this.wrapper.querySelector(".top .content-body");
    this.closeIcon = this.wrapper.querySelector(".top i");
    this.skew = 0;
    this.sliderPosition;

    if (this.wrapper.firstElementChild.classList.contains("skewed") === true) {
      this.skew = 1000;
    }

    /**
     * Event listeners for mouse and touch actions
     */

    //Validate if the handler needs to be clicked or dragged
    if (click === false) {
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
        // Remove CSS animation class from slider and top layer
        this.removeAnimation();

        document.addEventListener("touchend", this.onDragEndHandler);
        document.addEventListener("touchmove", this.onDragHandler);
      });
    } else {
      this.handle.addEventListener("click", event => {
        event.preventDefault();
        // Remove CSS animation class from slider and top layer
        this.removeAnimation();

        this.completeSlide(event);
      });

      this.handle.addEventListener("touchstart", event => {
        event.preventDefault();
        // Remove CSS animation class from slider and top layer
        this.removeAnimation();

        this.completeSlide(event);
      });
    }

    /**
     * Add events when the close icon is clicked or tapped
     */
    this.closeIcon.addEventListener("click", event => {
      event.preventDefault();
      // Remove CSS animation class from slider and top layer
      this.resetAnimation();

      this.resetSlider(event);
    });

    this.closeIcon.addEventListener("touchstart", event => {
      event.preventDefault();
      // Remove CSS animation class from slider and top layer
      this.resetAnimation();

      this.resetSlider(event);
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

  eventListeners() {}

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
    let windowWidth = window.innerWidth;
    let deltaBottom;

    deltaBottom = (windowWidth - positionX) / windowWidth;
    this.bottomContainer.style.opacity = deltaBottom;
    this.topContainer.style.opacity = 1 - deltaBottom;
  }

  completeSlide(event) {
    let initialPosition = event.pageX;
    let currentPosition = initialPosition;

    //Update bottom layer opacity
    this.bottomContainer.style.opacity = 1;
    let movement = setInterval(() => {
      // When the position is lower than 0 then stop the animation
      if (currentPosition < 0) {
        clearInterval(movement);
        this.sliderPosition = currentPosition;
        this.updateCloseIcon("show");
        this.updateHandle("hide");
      } else {
        currentPosition = currentPosition - 10;
        this.slider.style.left = currentPosition + "px";
        this.topLayer.style.width = currentPosition + this.skew + "px";
      }
    }, 1);
  }

  updateCloseIcon(action) {
    if (action === "show") {
      this.closeIcon.style.display = "block";
    } else {
      this.closeIcon.style.display = "none";
    }
  }

  updateHandle(action) {
    if (action === "show") {
      this.handle.style.display = "block";
    } else {
      this.handle.style.display = "none";
    }
  }

  resetSlider(event) {
    let currentPosition = initialPosition;
    let movement = setInterval(() => {
      // When the position is lower than 0 then stop the animation
      if (currentPosition > window.innerWidth / 2) {
        clearInterval(movement);
        this.updateCloseIcon("show");
        this.updateHandle("hide");
      } else {
        currentPosition = currentPosition - 5;
        this.slider.style.left = currentPosition + "px";
        this.topLayer.style.width = currentPosition + this.skew + "px";
      }
    }, 5);
  }
}
