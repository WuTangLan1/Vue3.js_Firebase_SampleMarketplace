<template>
    <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
</template>

<style>

.lds-grid {
  display: inline-block;
  position: relative;
  width: 40px; /* Adjusted width to fit inside the button */
  height: 40px; /* Adjusted height to fit inside the button */
}

.lds-grid div {
  position: absolute;
  width: 8px; /* Slightly bigger dots */
  height: 8px; /* Slightly bigger dots */
  border-radius: 50%;
  background: rgb(0, 238, 255);
  animation: lds-grid 1.2s linear infinite;
}

.lds-grid div:nth-child(1) {
  top: 4px; /* Adjusted positioning */
  left: 4px;
  animation-delay: 0s;
}

.lds-grid div:nth-child(2) {
  top: 4px;
  left: 16px; /* Adjusted positioning */
  animation-delay: -0.4s;
}

.lds-grid div:nth-child(3) {
  top: 4px;
  left: 28px; /* Adjusted positioning */
  animation-delay: -0.8s;
}

.lds-grid div:nth-child(4) {
  top: 16px; /* Adjusted positioning */
  left: 4px;
  animation-delay: -0.4s;
}

.lds-grid div:nth-child(5) {
  top: 16px;
  left: 16px; /* Adjusted positioning */
  animation-delay: -0.8s;
}

.lds-grid div:nth-child(6) {
  top: 16px;
  left: 28px; /* Adjusted positioning */
  animation-delay: -1.2s;
}

.lds-grid div:nth-child(7) {
  top: 28px; /* Adjusted positioning */
  left: 4px;
  animation-delay: -0.8s;
}

.lds-grid div:nth-child(8) {
  top: 28px;
  left: 16px; /* Adjusted positioning */
  animation-delay: -1.2s;
}

.lds-grid div:nth-child(9) {
  top: 28px;
  left: 28px; /* Adjusted positioning */
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

</style>