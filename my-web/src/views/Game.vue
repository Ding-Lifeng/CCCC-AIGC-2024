<template>
  <div class="game-container">
    <HeaderComponent class="header" />
    <div class="board">
      <div
          v-for="(row, rowIndex) in board"
          :key="rowIndex"
          class="row"
      >
        <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            :class="['cell', 'tile-' + cell]"
            :style="{ backgroundColor: getColor(cell) }"
        >
          {{ cell || '' }}
        </div>
      </div>
    </div>
    <button class="reset-button" @click="resetGame">重新开始</button>
    <FooterComponent class="footer" />
  </div>
</template>

<script>
import FooterComponent from '@/layout/FooterComponent.vue';
import HeaderComponent from '@/layout/HeaderComponent.vue';

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    };
  },
  mounted() {
    this.addTile();
    this.addTile();
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    getColor(value) {
      const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
      };
      return colors[value] || '#3c3a32';
    },
    addTile() {
      const emptyCells = [];
      this.board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell === 0) {
            emptyCells.push({rowIndex, cellIndex});
          }
        });
      });

      if (emptyCells.length) {
        const {rowIndex, cellIndex} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.$set(this.board[rowIndex], cellIndex, Math.random() > 0.9 ? 4 : 2);
      }
    },
    handleKeyPress(event) {
      // 阻止页面滚动
      event.preventDefault();

      let moved = false;

      switch (event.key) {
        case 'ArrowUp':
          moved = this.moveUp();
          break;
        case 'ArrowDown':
          moved = this.moveDown();
          break;
        case 'ArrowLeft':
          moved = this.moveLeft();
          break;
        case 'ArrowRight':
          moved = this.moveRight();
          break;
      }

      if (moved) {
        this.addTile();
        if (this.checkWin()) {
          alert("恭喜，您已通关!");
          this.resetGame();
        } else if (!this.canMove()) {
          alert("无法移动，请再试一次！");
          this.resetGame();
        }
      }
    },
    compress(row) {
      const newRow = row.filter(cell => cell !== 0);
      while (newRow.length < 4) newRow.push(0);
      return newRow;
    },
    merge(row) {
      for (let i = 0; i < 3; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          row[i + 1] = 0;
        }
      }
      return row;
    },
    moveLeft() {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        let column = this.board.map(row => row[i]);
        column = this.compress(column);
        column = this.merge(column);
        column = this.compress(column);
        for (let j = 0; j < 4; j++) {
          if (this.board[j][i] !== column[j]) moved = true;
        }
        for (let j = 0; j < 4; j++) {
          this.$set(this.board[j], i, column[j]);
        }
      }
      return moved;
    },
    moveRight() {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        let column = this.board.map(row => row[i]).reverse();
        column = this.compress(column);
        column = this.merge(column);
        column = this.compress(column);
        column.reverse();
        for (let j = 0; j < 4; j++) {
          if (this.board[j][i] !== column[j]) moved = true;
        }
        for (let j = 0; j < 4; j++) {
          this.$set(this.board[j], i, column[j]);
        }
      }
      return moved;
    },
    moveUp() {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        let row = this.board[i];
        row = this.compress(row);
        row = this.merge(row);
        row = this.compress(row);
        if (this.board[i].toString() !== row.toString()) moved = true;
        this.$set(this.board, i, row);
      }
      return moved;
    },
    moveDown() {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        let row = this.board[i].slice().reverse();
        row = this.compress(row);
        row = this.merge(row);
        row = this.compress(row);
        row.reverse();
        if (this.board[i].toString() !== row.toString()) moved = true;
        this.$set(this.board, i, row);
      }
      return moved;
    },
    resetGame() {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.addTile();
      this.addTile();
    },
    checkWin() {
      return this.board.some(row => row.includes(2048));
    },
    canMove() {
      // 检查是否可以移动
      const directions = ['Left', 'Right', 'Up', 'Down'];
      return directions.some(direction => {
        const boardCopy = this.board.map(row => [...row]);
        let moved = false;
        switch (direction) {
          case 'Left':
            moved = this.moveLeft();
            break;
          case 'Right':
            moved = this.moveRight();
            break;
          case 'Up':
            moved = this.moveUp();
            break;
          case 'Down':
            moved = this.moveDown();
            break;
        }
        this.board = boardCopy; // 恢复原始状态
        return moved;
      });
    },
  },
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #faf8ef;
  padding: 20px;
}

.header, .footer {
  width: 100%;
}

.board {
  display: grid;
  grid-template-rows: repeat(4, 180px);
  grid-template-columns: repeat(4, 180px);
  background-color: #bbada0;
  border-radius: 10px;
  margin-bottom: 20px;
}

.cell {
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #776e65;
  border-radius: 10px;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.reset-button {
  margin-top: -30px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #f78f54;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #d97242;
}
</style>