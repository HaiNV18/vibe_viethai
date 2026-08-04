/**
 * ============================================================================
 * GAME CỜ CARO (GOMOKU) - JAVASCRIPT THUẦN (ES6+) & HTML5 CANVAS
 * ============================================================================
 * Kiến trúc Đối tượng (OOP):
 * 1. Board       : Quản lý ma trận bàn cờ 20x20, lưu lịch sử nước đi & kiểm tra thắng
 * 2. Renderer    : Đảm nhận việc vẽ nền gỗ, lưới, quân cờ, hiệu ứng hover & animation
 * 3. InputHandler: Xử lý sự kiện chuột (click, hover), quy đổi tọa độ & phím tắt
 * 4. Game        : Quản lý luồng trò chơi, đếm giờ 30s, lượt chơi, lưu/tải localStorage
 * ============================================================================
 */

/* ============================================================================
 * 1. CLASS BOARD - QUẢN LÝ TRẠNG THÁI VÀ LOGIC BÀN CỜ
 * ============================================================================ */
class Board {
    /**
     * Khởi tạo bàn cờ với số hàng và số cột mặc định 20x20
     * @param {number} rows - Số hàng (mặc định 20)
     * @param {number} cols - Số cột (mặc định 20)
     */
    constructor(rows = 20, cols = 20) {
        this.rows = rows;
        this.cols = cols;
        // Ma trận 2D lưu giá trị ô cờ: null (trống), 'X', hoặc 'O'
        this.grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
        // Lịch sử các nước đi đã thực hiện [{row, col, player, timestamp}]
        this.history = [];
        // Danh sách 5 tọa độ quân cờ thắng cuộc [{row, col}, ...]
        this.winningLine = null;
    }

    /**
     * Khôi phục bàn cờ về trạng thái rỗng ban đầu
     */
    reset() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = null;
            }
        }
        this.history = [];
        this.winningLine = null;
    }

    /**
     * Kiểm tra vị trí (row, col) có nằm trong bàn cờ và đang trống hay không
     * @param {number} row - Chỉ số dòng
     * @param {number} col - Chỉ số cột
     * @returns {boolean} True nếu nước đi hợp lệ
     */
    isValidMove(row, col) {
        return (
            row >= 0 && row < this.rows &&
            col >= 0 && col < this.cols &&
            this.grid[row][col] === null
        );
    }

    /**
     * Đặt quân cờ của người chơi vào vị trí (row, col)
     * @param {number} row - Chỉ số dòng
     * @param {number} col - Chỉ số cột
     * @param {string} player - 'X' hoặc 'O'
     * @returns {boolean} Trả về true nếu đặt thành công
     */
    placePiece(row, col, player) {
        if (!this.isValidMove(row, col)) return false;

        this.grid[row][col] = player;
        this.history.push({ row, col, player, timestamp: Date.now() });
        return true;
    }

    /**
     * Rút lại nước đi gần nhất (Undo)
     * @returns {object|null} Nước đi vừa bị hủy hoặc null nếu lịch sử trống
     */
    undoLastMove() {
        if (this.history.length === 0) return null;

        const lastMove = this.history.pop();
        this.grid[lastMove.row][lastMove.col] = null;
        this.winningLine = null; // Xóa trạng thái thắng nếu undo
        return lastMove;
    }

    /**
     * Thuật toán kiểm tra thắng cuộc tối ưu:
     * Chỉ kiểm tra 4 hướng từ vị trí nước đi vừa đặt (row, col).
     * 4 hướng gồm:
     * - Ngang (Horizontal): dx=1, dy=0
     * - Dọc (Vertical): dx=0, dy=1
     * - Chéo chính (Main Diagonal \): dx=1, dy=1
     * - Chéo phụ (Anti Diagonal /): dx=1, dy=-1
     * 
     * @param {number} row - Dòng của nước đi vừa đặt
     * @param {number} col - Cột của nước đi vừa đặt
     * @returns {Array|null} Trả về mảng chứa 5 tọa độ thắng cuộc hoặc null nếu chưa ai thắng
     */
    checkWin(row, col) {
        const player = this.grid[row][col];
        if (!player) return null;

        // 4 hướng di chuyển [deltaCol, deltaRow]
        const directions = [
            { dx: 1, dy: 0 },  // Ngang
            { dx: 0, dy: 1 },  // Dọc
            { dx: 1, dy: 1 },  // Chéo xuống bên phải (\)
            { dx: 1, dy: -1 }  // Chéo lên bên phải (/)
        ];

        for (const dir of directions) {
            const line = [{ row, col }];

            // Duyệt tiến theo hướng dir (forward)
            let r = row + dir.dy;
            let c = col + dir.dx;
            while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.grid[r][c] === player) {
                line.push({ row: r, col: c });
                r += dir.dy;
                c += dir.dx;
            }

            // Duyệt lùi theo hướng ngược lại (backward)
            r = row - dir.dy;
            c = col - dir.dx;
            while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.grid[r][c] === player) {
                line.push({ row: r, col: c });
                r -= dir.dy;
                c -= dir.dx;
            }

            // Nếu đạt đủ 5 quân liên tiếp trở lên -> Thắng cuộc!
            if (line.length >= 5) {
                this.winningLine = line;
                return line;
            }
        }

        return null;
    }

    /**
     * Chuẩn hóa dữ liệu bàn cờ để lưu vào localStorage
     */
    serialize() {
        return {
            grid: this.grid,
            history: this.history,
            winningLine: this.winningLine
        };
    }

    /**
     * Khôi phục bàn cờ từ dữ liệu lưu trữ
     */
    deserialize(data) {
        if (!data) return;
        this.grid = data.grid || this.grid;
        this.history = data.history || [];
        this.winningLine = data.winningLine || null;
    }
}


/* ============================================================================
 * 2. CLASS RENDERER - VẼ GIAO DIỆN & HIỆU ỨNG ANIMATION VỚI HTML5 CANVAS
 * ============================================================================ */
class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas - Thẻ canvas
     * @param {Board} board - Đối tượng Board
     */
    constructor(canvas, board) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.board = board;

        // Kích thước mỗi ô cờ (800px / 20 = 40px)
        this.cellSize = canvas.width / board.cols;

        // Trạng thái hover con trỏ chuột {row, col}
        this.hoverCell = null;

        // Trạng thái animation khi vừa đặt quân cờ {row, col, player, scale, startTime}
        this.animatingPiece = null;

        // Quản lý loop vẽ đồ họa
        this.animationFrameId = null;

        // Đảm bảo bật font smoothing / anti-aliasing
        this.ctx.imageSmoothingEnabled = true;
    }

    /**
     * Bắt đầu vòng lặp vẽ liên tục bằng requestAnimationFrame
     */
    startLoop() {
        const renderLoop = (timestamp) => {
            this.draw(timestamp);
            this.animationFrameId = requestAnimationFrame(renderLoop);
        };
        this.animationFrameId = requestAnimationFrame(renderLoop);
    }

    /**
     * Dừng vòng lặp vẽ
     */
    stopLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Hàm render chính thực hiện các công đoạn vẽ theo thứ tự
     * @param {number} timestamp - Thời gian hiện tại do requestAnimationFrame cung cấp
     */
    draw(timestamp) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Vẽ nền gỗ và các ô cờ
        this.drawBoardBackground();

        // 2. Vẽ lưới bàn cờ và điểm định vị (Hoshi)
        this.drawGrid();

        // 3. Vẽ ô đang được rê chuột qua (Hover effect)
        this.drawHoverEffect();

        // 4. Vẽ các quân cờ đã đánh trên bàn cờ
        this.drawPieces(timestamp);

        // 5. Vẽ đường highlight tô sáng 5 quân cờ thắng (nếu có)
        this.drawWinningHighlight(timestamp);
    }

    /**
     * Vẽ nền gỗ sang trọng với hiệu ứng gradient ấm áp
     */
    drawBoardBackground() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Radial Gradient tạo hiệu ứng ánh sáng hội tụ ở giữa bàn cờ gỗ
        const bgGradient = this.ctx.createRadialGradient(
            width / 2, height / 2, 50,
            width / 2, height / 2, width * 0.7
        );
        bgGradient.addColorStop(0, '#eac086'); // Vàng gỗ sáng ở giữa
        bgGradient.addColorStop(1, '#c89551'); // Nâu gỗ đậm dần ra viền

        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, width, height);
    }

    /**
     * Vẽ lưới 20x20 rõ ràng và các điểm chấm định vị phong cách cờ Chô-Han/Gomoku
     */
    drawGrid() {
        const { rows, cols } = this.board;
        const size = this.cellSize;

        this.ctx.save();
        this.ctx.strokeStyle = '#5a3a1a'; // Màu đường kẻ gỗ trầm
        this.ctx.lineWidth = 1.2;

        // Vẽ các đường dọc và đường ngang
        for (let i = 0; i <= rows; i++) {
            // Đường ngang
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * size);
            this.ctx.lineTo(cols * size, i * size);
            this.ctx.stroke();

            // Đường dọc
            this.ctx.beginPath();
            this.ctx.moveTo(i * size, 0);
            this.ctx.lineTo(i * size, rows * size);
            this.ctx.stroke();
        }

        // Vẽ các điểm định vị (Star points / Hoshi) chuẩn bàn cờ 20x20
        const starPoints = [
            { r: 3, c: 3 }, { r: 3, c: 16 },
            { r: 16, c: 3 }, { r: 16, c: 16 },
            { r: 10, c: 10 }
        ];

        this.ctx.fillStyle = '#422810';
        for (const pt of starPoints) {
            const centerX = (pt.c + 0.5) * size;
            const centerY = (pt.r + 0.5) * size;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    /**
     * Vẽ ô hover dưới con trỏ chuột
     */
    drawHoverEffect() {
        if (!this.hoverCell) return;
        const { row, col } = this.hoverCell;
        const size = this.cellSize;

        // Chỉ hiển thị hover nếu ô còn trống
        if (this.board.grid[row][col] !== null) return;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 2;

        const x = col * size + 2;
        const y = row * size + 2;
        const w = size - 4;

        // Vẽ ô vuông bo tròn mờ nhẹ tại vị trí đang chọn
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, w, 6);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Vẽ toàn bộ quân cờ X và O với hiệu ứng bóng đổ 3D & animation thả quân
     * @param {number} timestamp 
     */
    drawPieces(timestamp) {
        const { rows, cols, grid } = this.board;
        const size = this.cellSize;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const player = grid[r][c];
                if (!player) continue;

                let scale = 1.0;

                // Xử lý animation scale nhẹ cho quân cờ vừa mới đặt
                if (
                    this.animatingPiece &&
                    this.animatingPiece.row === r &&
                    this.animatingPiece.col === c
                ) {
                    const elapsed = timestamp - this.animatingPiece.startTime;
                    const duration = 200; // 200ms animation
                    if (elapsed < duration) {
                        const progress = elapsed / duration;
                        // Phóng to nhẹ từ 0.2 -> 1.1 rồi nảy về 1.0
                        scale = Math.sin(progress * Math.PI) * 0.3 + (0.2 + 0.8 * progress);
                    } else {
                        this.animatingPiece = null; // Kết thúc animation
                    }
                }

                if (player === 'X') {
                    this.drawXPiece(r, c, scale);
                } else if (player === 'O') {
                    this.drawOPiece(r, c, scale);
                }
            }
        }
    }

    /**
     * Vẽ quân X màu đỏ nổi bật dạng 3D
     */
    drawXPiece(row, col, scale = 1.0) {
        const size = this.cellSize;
        const centerX = (col + 0.5) * size;
        const centerY = (row + 0.5) * size;
        const radius = (size * 0.35) * scale;

        this.ctx.save();

        // Shadow hiệu ứng nổi 3D
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 3;

        // Gradient cho chữ X Đỏ
        const gradient = this.ctx.createLinearGradient(
            centerX - radius, centerY - radius,
            centerX + radius, centerY + radius
        );
        gradient.addColorStop(0, '#ff6b81'); // Hồng đỏ sáng ở trên
        gradient.addColorStop(1, '#ff4757'); // Đỏ tươi đậm hơn ở dưới

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = Math.max(3, 6 * scale);
        this.ctx.lineCap = 'round';

        // Nét 1: Chéo xuống
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - radius, centerY - radius);
        this.ctx.lineTo(centerX + radius, centerY + radius);
        this.ctx.stroke();

        // Nét 2: Chéo lên
        this.ctx.beginPath();
        this.ctx.moveTo(centerX + radius, centerY - radius);
        this.ctx.lineTo(centerX - radius, centerY + radius);
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Vẽ quân O màu xanh dương dạng 3D
     */
    drawOPiece(row, col, scale = 1.0) {
        const size = this.cellSize;
        const centerX = (col + 0.5) * size;
        const centerY = (row + 0.5) * size;
        const radius = (size * 0.33) * scale;

        this.ctx.save();

        // Shadow nổi 3D
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 3;

        // Gradient cho vòng tròn O Xanh
        const gradient = this.ctx.createLinearGradient(
            centerX - radius, centerY - radius,
            centerX + radius, centerY + radius
        );
        gradient.addColorStop(0, '#70a1ff'); // Xanh dương sáng ở trên
        gradient.addColorStop(1, '#1e90ff'); // Xanh dương ngọc ở dưới

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = Math.max(3, 5.5 * scale);

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Hiệu ứng highlight phát sáng nhấp nháy 5 quân thắng cuộc
     * @param {number} timestamp 
     */
    drawWinningHighlight(timestamp) {
        const winningLine = this.board.winningLine;
        if (!winningLine || winningLine.length === 0) return;

        const size = this.cellSize;

        // Tạo hiệu ứng nhấp nháy nhịp nhàng bằng hàm Sine thời gian
        const pulse = (Math.sin(timestamp * 0.008) + 1) / 2; // Giá trị từ 0.0 -> 1.0
        const auraRadius = (size * 0.4) + pulse * 4;

        this.ctx.save();

        // 1. Vẽ vòng hào quang vàng kim xung quanh từng quân cờ thắng
        for (const pt of winningLine) {
            const centerX = (pt.col + 0.5) * size;
            const centerY = (pt.row + 0.5) * size;

            this.ctx.shadowColor = '#ffa502';
            this.ctx.shadowBlur = 12 + pulse * 10;
            this.ctx.fillStyle = `rgba(255, 215, 0, ${0.35 + pulse * 0.35})`;

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 2. Vẽ đường nối kết nối 5 quân thắng cuộc
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 4;
        this.ctx.shadowColor = '#ffa502';
        this.ctx.shadowBlur = 15;

        for (let i = 0; i < winningLine.length; i++) {
            const pt = winningLine[i];
            const x = (pt.col + 0.5) * size;
            const y = (pt.row + 0.5) * size;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Đăng ký hiệu ứng animation thả quân mới
     */
    triggerPlaceAnimation(row, col, player) {
        this.animatingPiece = {
            row,
            col,
            player,
            startTime: performance.now()
        };
    }
}


/* ============================================================================
 * 3. CLASS INPUTHANDLER - XỬ LÝ SỰ KIỆN TƯƠNG TÁC CHUỘT & BÀN PHÍM
 * ============================================================================ */
class InputHandler {
    /**
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Game} game - Đối tượng Game điều khiển chính
     */
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;

        this.initEvents();
    }

    /**
     * Đăng ký các sự kiện chuột & bàn phím
     */
    initEvents() {
        // Sự kiện rê chuột trên canvas
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Rời chuột khỏi canvas -> Xóa ô hover
        this.canvas.addEventListener('mouseleave', () => {
            this.game.renderer.hoverCell = null;
        });

        // Click chuột trên canvas -> Đánh cờ
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Sự kiện phím tắt bàn phím
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    /**
     * Chuyển đổi tọa độ chuột từ màn hình (Screen/DOM) sang chỉ số dòng & cột của bàn cờ
     * Tính toán chính xác cả khi Canvas bị scale theo CSS responsive
     */
    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const col = Math.floor(x / this.game.renderer.cellSize);
        const row = Math.floor(y / this.game.renderer.cellSize);

        return { row, col };
    }

    /**
     * Cập nhật tọa độ hover cho Renderer
     */
    handleMouseMove(e) {
        if (this.game.isGameOver) {
            this.game.renderer.hoverCell = null;
            return;
        }

        const { row, col } = this.getCanvasCoords(e);
        if (row >= 0 && row < this.game.board.rows && col >= 0 && col < this.game.board.cols) {
            this.game.renderer.hoverCell = { row, col };
        } else {
            this.game.renderer.hoverCell = null;
        }
    }

    /**
     * Xử lý khi người chơi click vào canvas
     */
    handleClick(e) {
        if (this.game.isGameOver) return;

        const { row, col } = this.getCanvasCoords(e);
        this.game.handleCellClick(row, col);
    }

    /**
     * Xử lý phím tắt
     * - R / r: Restart game
     * - Ctrl + Z: Hoàn tác (Undo)
     */
    handleKeyDown(e) {
        // Phím R: Restart
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.game.restart();
            return;
        }

        // Phím Ctrl + Z: Undo
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
            e.preventDefault();
            this.game.undo();
            return;
        }
    }
}


/* ============================================================================
 * 4. CLASS GAME - QUẢN LÝ LUỒNG CHƠI, ĐẾM GIỜ, LƯỢT CHƠI VÀ LƯU TRẠNG THÁI
 * ============================================================================ */
class Game {
    constructor() {
        // Đặt tên key lưu vào localStorage
        this.STORAGE_KEY = 'caro_gomoku_save_state';
        
        // Thời gian tối đa mỗi lượt (30 giây)
        this.TURN_TIME_LIMIT = 30;

        // Khởi tạo các thành phần cốt lõi
        this.board = new Board(20, 20);

        const canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(canvas, this.board);
        this.inputHandler = new InputHandler(canvas, this);

        // Trạng thái game
        this.currentPlayer = 'X'; // Nước đầu tiên mặc định là X (Đỏ)
        this.isGameOver = false;
        this.winner = null; // 'X', 'O', hoặc 'Draw'
        this.moveCount = 0;

        // Đồng hồ đếm ngược 30s
        this.timeLeft = this.TURN_TIME_LIMIT;
        this.timerInterval = null;

        // Lấy các DOM elements hiển thị UI
        this.ui = {
            playerXBadge: document.getElementById('player-x-badge'),
            playerOBadge: document.getElementById('player-o-badge'),
            timerText: document.getElementById('timer-text'),
            timerBar: document.getElementById('timer-bar'),
            moveCountText: document.getElementById('move-count'),
            gameStatusText: document.getElementById('game-status'),
            btnUndo: document.getElementById('btn-undo'),
            btnRestart: document.getElementById('btn-restart'),
            btnNewGame: document.getElementById('btn-newgame')
        };
    }

    /**
     * Khởi chạy game: Gắn sự kiện nút bấm, tải dữ liệu lưu trữ (nếu có) và bắt đầu loop
     */
    init() {
        // Đăng ký sự kiện các nút UI
        this.ui.btnUndo.addEventListener('click', () => this.undo());
        this.ui.btnRestart.addEventListener('click', () => this.restart());
        this.ui.btnNewGame.addEventListener('click', () => this.restart());

        // Thử khôi phục game từ localStorage
        const loaded = this.loadState();

        if (!loaded) {
            this.updateUI();
        }

        // Bắt đầu vòng lặp vẽ Canvas
        this.renderer.startLoop();

        // Khởi động đồng hồ đếm ngược nếu game chưa kết thúc
        if (!this.isGameOver) {
            this.startTimer();
        }
    }

    /**
     * Xử lý nước đi khi click ô cờ (row, col)
     */
    handleCellClick(row, col) {
        if (this.isGameOver) return;

        // Đặt quân cờ vào Board
        const success = this.board.placePiece(row, col, this.currentPlayer);
        if (!success) return; // Ô cờ không hợp lệ hoặc đã có quân

        // Kích hoạt animation phóng to nhẹ cho quân cờ vừa đặt
        this.renderer.triggerPlaceAnimation(row, col, this.currentPlayer);

        this.moveCount++;

        // Kiểm tra điều kiện thắng cuộc
        const winningLine = this.board.checkWin(row, col);

        if (winningLine) {
            // Có người chiến thắng!
            this.isGameOver = true;
            this.winner = this.currentPlayer;
            this.stopTimer();
            this.updateUI();
            this.saveState();
            return;
        }

        // Kiểm tra hòa (nếu đánh kín bàn cờ 400 ô)
        if (this.moveCount >= this.board.rows * this.board.cols) {
            this.isGameOver = true;
            this.winner = 'Draw';
            this.stopTimer();
            this.updateUI();
            this.saveState();
            return;
        }

        // Đổi lượt chơi và reset đồng hồ 30s
        this.switchTurn();
        this.saveState();
    }

    /**
     * Đổi lượt chơi giữa X và O
     */
    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.resetTimer();
        this.updateUI();
    }

    /**
     * Bắt đầu đếm ngược thời gian lượt chơi
     */
    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;

            this.updateTimerUI();

            // Nếu hết 30 giây -> Tự động chuyển lượt!
            if (this.timeLeft <= 0) {
                this.switchTurn();
            }
        }, 1000);
    }

    /**
     * Reset đồng hồ đếm giờ về 30 giây
     */
    resetTimer() {
        this.timeLeft = this.TURN_TIME_LIMIT;
        this.updateTimerUI();
        this.startTimer();
    }

    /**
     * Dừng đồng hồ đếm giờ
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Cập nhật thanh thời gian và số giây hiển thị
     */
    updateTimerUI() {
        this.ui.timerText.textContent = `${this.timeLeft}s`;
        const percentage = (this.timeLeft / this.TURN_TIME_LIMIT) * 100;
        this.ui.timerBar.style.width = `${percentage}%`;

        // Đổi màu thanh đếm ngược khi thời gian sắp hết (dưới 10 giây)
        if (this.timeLeft <= 10) {
            this.ui.timerBar.classList.add('warning');
        } else {
            this.ui.timerBar.classList.remove('warning');
        }
    }

    /**
     * Rút lại nước đi vừa đánh (Undo)
     */
    undo() {
        if (this.board.history.length === 0) return;

        // Nếu game đang kết thúc, hủy trạng thái Game Over để tiếp tục chơi
        if (this.isGameOver) {
            this.isGameOver = false;
            this.winner = null;
            this.board.winningLine = null;
        }

        const undoneMove = this.board.undoLastMove();
        if (undoneMove) {
            this.moveCount = Math.max(0, this.moveCount - 1);
            // Đổi lại lượt chơi về người vừa được undo
            this.currentPlayer = undoneMove.player;
            this.resetTimer();
            this.updateUI();
            this.saveState();
        }
    }

    /**
     * Đặt lại trò chơi mới từ đầu (Restart / Bắt đầu mới)
     */
    restart() {
        this.board.reset();
        this.currentPlayer = 'X';
        this.isGameOver = false;
        this.winner = null;
        this.moveCount = 0;
        this.renderer.hoverCell = null;
        this.renderer.animatingPiece = null;

        this.resetTimer();
        this.updateUI();
        this.clearSaveState();
    }

    /**
     * Cập nhật toàn bộ giao diện HTML (Lượt đi, Trạng thái, Nút bấm)
     */
    updateUI() {
        // Cập nhật lượt chơi hiển thị trên thẻ Badge
        if (this.currentPlayer === 'X') {
            this.ui.playerXBadge.classList.add('active');
            this.ui.playerOBadge.classList.remove('active');
        } else {
            this.ui.playerOBadge.classList.add('active');
            this.ui.playerXBadge.classList.remove('active');
        }

        // Cập nhật số nước đi
        this.ui.moveCountText.textContent = this.moveCount;

        // Cập nhật trạng thái game
        if (this.isGameOver) {
            if (this.winner === 'X') {
                this.ui.gameStatusText.textContent = '🎉 Người chơi 1 (X) Thắng!';
                this.ui.gameStatusText.className = 'stat-value status-win-x';
            } else if (this.winner === 'O') {
                this.ui.gameStatusText.textContent = '🎉 Người chơi 2 (O) Thắng!';
                this.ui.gameStatusText.className = 'stat-value status-win-o';
            } else {
                this.ui.gameStatusText.textContent = '🤝 Trận đấu Hòa!';
                this.ui.gameStatusText.className = 'stat-value status-draw';
            }
        } else {
            this.ui.gameStatusText.textContent = `Đang chơi (${this.currentPlayer === 'X' ? 'Lượt X' : 'Lượt O'})`;
            this.ui.gameStatusText.className = 'stat-value status-playing';
        }

        // Vô hiệu hóa nút Undo nếu không có nước đi để hoàn tác
        this.ui.btnUndo.disabled = this.board.history.length === 0;

        // Cập nhật đồng hồ UI
        this.updateTimerUI();
    }

    /**
     * Lưu trạng thái trò chơi hiện tại vào localStorage
     */
    saveState() {
        try {
            const gameState = {
                board: this.board.serialize(),
                currentPlayer: this.currentPlayer,
                isGameOver: this.isGameOver,
                winner: this.winner,
                moveCount: this.moveCount,
                timeLeft: this.timeLeft
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameState));
        } catch (e) {
            console.warn('Không thể lưu trạng thái game vào localStorage:', e);
        }
    }

    /**
     * Tải trạng thái trò chơi từ localStorage khi khởi động
     */
    loadState() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) return false;

            const gameState = JSON.parse(saved);
            this.board.deserialize(gameState.board);
            this.currentPlayer = gameState.currentPlayer || 'X';
            this.isGameOver = gameState.isGameOver || false;
            this.winner = gameState.winner || null;
            this.moveCount = gameState.moveCount || 0;
            this.timeLeft = gameState.timeLeft !== undefined ? gameState.timeLeft : this.TURN_TIME_LIMIT;

            this.updateUI();
            return true;
        } catch (e) {
            console.warn('Không thể khôi phục trạng thái từ localStorage:', e);
            return false;
        }
    }

    /**
     * Xóa dữ liệu lưu trữ khi bắt đầu ván mới
     */
    clearSaveState() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('Không thể xóa localStorage:', e);
        }
    }
}


/* ============================================================================
 * KHỞI TẠO VÀ CHẠY GAME KHI TRANG ĐƯỢC TẢI XONG
 * ============================================================================ */
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
