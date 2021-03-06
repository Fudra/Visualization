<template>
  <div class="bg-white rounded-lg p-6 shadow-md flex flex-col items-center ">
    <InfoDialog :text="dialogText" :title="dialogTitle" @startQuiz="startQuiz" />
    <header class="">
      <div class="px-4">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          {{ quiz }}
        </h1>
      </div>
    </header>
    <main>
      <div class="py-4">
        <Quiz :startQuiz="showQuiz" :timeout="timeout" :draw="draw" />
      </div>
    </main>
    <footer>
      <div class="px-4 flex w-full">
        <QuizAnswer @answer="quizAnswer" :text="quizAnswerText" />
      </div>
    </footer>
  </div>
</template>

<script>
import Quiz from "./../../components/Quiz.vue";
import InfoDialog from "./../../components/InfoDialog";
import QuizAnswer from "./../../components/QuizAnswer";

export default {
  name: "viz04",
  components: {
    Quiz,
    InfoDialog,
    QuizAnswer
  },
  data() {
    return {
      showQuiz: false,
      quiz: "Quiz #04"
    };
  },

  methods: {
    draw(sketch) {
      // clear
      sketch.background(0, 0, 0);
      // help functions
      let getRandomInt = max => {
        return Math.floor(Math.random() * Math.floor(max));
      };
      let getRandomRange = (min, max) => {
        return Math.floor(Math.random() * Math.floor(max - min)) + min;
      };

      let getRandomItem = array => {
        return array[Math.floor(Math.random() * array.length)];
      };

      let colors = [
        [102, 126, 234], // indigo-500
        [159, 122, 234], // purple-500
        [160, 174, 192], // gray-500
        [236, 201, 752], // orange-500
        [72, 187, 120], // green-500
        [236, 201, 75], // yellow-500
        [66, 153, 225] // blue-500
      ];
      // 	245, 101, 101 // red-500

      let createDotElement = (sketch, target = false) => {
        let randomX = getRandomRange(20, sketch.width - 20);
        let randomY = getRandomRange(50, sketch.height - 50);

        if (target) {
          sketch.fill(245, 101, 101);
          sketch.circle(randomX, randomY, 20);
        } else {
          sketch.fill(...getRandomItem(colors));
          sketch.circle(randomX, randomY, 20);
        }
      };

      // vars
      let distractors = 30;

      let hasTarget = getRandomInt(2);

      // inform state
      this.$store.dispatch("setTarget", { target: !!hasTarget });

      for (let i = 0; i < distractors / 2; i++) {
        createDotElement(sketch, false);
      }

      if (hasTarget) {
        createDotElement(sketch, true);
      }

      for (let i = 0; i < distractors / 2; i++) {
        createDotElement(sketch, false);
      }
    },

    startQuiz() {
      console.log("starting...");
      this.showQuiz = true;
    },

    quizAnswer(answer) {
      this.$store.dispatch("setNewAnswer", {
        quiz: this.quiz,
        text: this.dialogText,
        answer: answer.text,
        hasTarget: this.hasTarget,
        time: this.timeout
      });

      this.$router.push({ name: "viz05" });
    }
  },
  computed: {
    hasTarget() {
      return this.$store.state.target;
    },
    timeout() {
      return this.$store.getters.getTimeout;
    },
    dialogText() {
      return "Bei der folgenden Aufgabe ist es zu erkennen, ob sich in der Menge der Kreise ein roter Kreis befindet";
    },
    dialogTitle() {
      return this.quiz;
    },
    quizAnswerText() {
      return "War auf dem oben gezeigtem Bild ein roter Kreis zu sehen?";
    }
  }
};
</script>
