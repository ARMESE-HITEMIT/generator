function generatePermissionSvg(permissions, times, access, color = '#111111') {
  const OBJECT_WIDTH = 270;
  const OBJECT_HEIGHT = 360;
  const CELL = 90;
  const TILE_INSET = 6;
  const TILE_SIZE = CELL - TILE_INSET * 2;
  const TILE_RADIUS = 14;
  const DOT_RADIUS = 24;
  const DOT_STROKE = 13;

  const columns = [
    { id: "permissions", label: "Permissions", icon: "key", value: permissions },
    { id: "times", label: "Times", icon: "sundial", value: times },
    { id: "access", label: "Access", icon: "gear", value: access }
  ];

  function clampLevel(value) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return 0;
    }
    return Math.max(0, Math.min(6, parsed));
  }

  function getDotState(level, rowIndex) {
    const slotFromBottom = 3 - rowIndex;
    const oddThreshold = slotFromBottom * 2 - 1;
    const evenThreshold = slotFromBottom * 2;

    if (level >= evenThreshold) {
      return "filled";
    }

    if (level === oddThreshold) {
      return "hollow";
    }

    return "empty";
  }

  function renderTopTile(columnIndex, rowIndex) {
    const x = columnIndex * CELL + TILE_INSET;
    const y = rowIndex * CELL + TILE_INSET;

    return `
      <rect
        x="${x}"
        y="${y}"
        width="${TILE_SIZE}"
        height="${TILE_SIZE}"
        rx="${TILE_RADIUS}"
        fill="none"
        stroke="${color}"
        stroke-width="3"
      />
    `;
  }

  function renderIconTile(columnIndex) {
    const x = columnIndex * CELL + TILE_INSET;
    const y = 3 * CELL + TILE_INSET;

    return `
      <rect
        x="${x}"
        y="${y}"
        width="${TILE_SIZE}"
        height="${TILE_SIZE}"
        rx="${TILE_RADIUS}"
        fill="${color}"
      />
    `;
  }

  function renderDot(columnIndex, rowIndex, state) {
    if (state === "empty") {
      return "";
    }

    const cx = columnIndex * CELL + CELL / 2;
    const cy = rowIndex * CELL + CELL / 2;
    const fill = state === "filled" ? color : "none";
    const stroke = color;

    return `
      <circle
        cx="${cx}"
        cy="${cy}"
        r="${DOT_RADIUS}"
        fill="${fill}"
        stroke="${stroke}"
        stroke-width="${DOT_STROKE}"
      />
    `;
  }

  function renderIconUse(columnIndex, iconId) {
    const x = columnIndex * CELL + TILE_INSET;
    const y = 3 * CELL + TILE_INSET;

    return `
      <use
        href="#icon-${iconId}"
        x="${x + 17}"
        y="${y + 17}"
        width="${TILE_SIZE - 34}"
        height="${TILE_SIZE - 34}"
        color="white"
      />
    `;
  }

  const topTiles = [];
  const dots = [];
  const iconTiles = [];
  const icons = [];

  columns.forEach((column, columnIndex) => {
    const value = clampLevel(column.value);
    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      topTiles.push(renderTopTile(columnIndex, rowIndex));
      dots.push(renderDot(columnIndex, rowIndex, getDotState(value, rowIndex)));
    }

    iconTiles.push(renderIconTile(columnIndex));
    icons.push(renderIconUse(columnIndex, column.icon));
  });

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="auto"
      viewBox="0 0 ${OBJECT_WIDTH} ${OBJECT_HEIGHT}"
      aria-label="Permission object"
      role="img"
    >
      <title>Permission object</title>
      <defs>
        <symbol id="icon-key" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22.0607 4.06066C22.6464 3.47487 22.6464 2.52513 22.0607 1.93934C21.4749 1.35355 20.5251 1.35355 19.9393 1.93934L11.2747 10.6039C10.1856 9.90521 8.89011 9.5 7.5 9.5C3.63401 9.5 0.5 12.634 0.5 16.5C0.5 20.366 3.63401 23.5 7.5 23.5C11.366 23.5 14.5 20.366 14.5 16.5C14.5 15.1099 14.0948 13.8144 13.3961 12.7253L16.2129 9.90838L17.4841 11.1795C18.2652 11.9606 19.5315 11.9606 20.3125 11.1795L22.7889 8.70313C23.57 7.92208 23.57 6.65575 22.7889 5.8747L21.5178 4.60354L22.0607 4.06066ZM3.5 16.5C3.5 14.2909 5.29086 12.5 7.5 12.5C9.70914 12.5 11.5 14.2909 11.5 16.5C11.5 18.7091 9.70914 20.5 7.5 20.5C5.29086 20.5 3.5 18.7091 3.5 16.5Z"
          />
        </symbol>

        <symbol id="icon-gear" viewBox="0 0 512 512">
          <path
            fill="currentColor"
            d="M497.569 215.166L442.224 202.102C438.192 188.156 432.729 174.832 425.848 162.37L455.698 114.067C460.268 106.67 459.15 97.121 453.01 90.981L421.02 58.991C414.891 52.862 405.342 51.743 397.944 56.313L349.652 86.164C337.19 79.282 323.867 73.82 309.92 69.787L296.856 14.419C294.856 5.978 287.306 0 278.63 0H233.393C224.715 0 217.166 5.978 215.166 14.419L202.102 69.787C188.156 73.819 174.832 79.271 162.37 86.164L114.067 56.292C106.68 51.743 97.121 52.851 90.981 58.991L58.99 90.97C52.86 97.11 51.742 106.679 56.301 114.057L86.163 162.37C79.281 174.832 73.819 188.156 69.796 202.091L14.418 215.156C5.978 217.165 0 224.704 0 233.392V278.618C0 287.296 5.978 294.855 14.418 296.844L69.796 309.909C73.828 323.855 79.281 337.168 86.163 349.619L56.291 397.943C51.742 405.341 52.85 414.9 58.99 421.041L90.969 453.02C97.109 459.16 106.678 460.277 114.056 455.708L162.379 425.836C174.842 432.718 188.165 438.18 202.101 442.202L215.165 497.568C217.165 506.031 224.714 512 233.392 512H278.629C287.306 512 294.855 506.031 296.855 497.568L309.919 442.202C323.856 438.181 337.178 432.718 349.631 425.836L397.943 455.697C405.341 460.267 414.89 459.149 421.03 453.009L453.019 421.019C459.149 414.89 460.267 405.331 455.697 397.932L425.836 349.63C432.729 337.178 438.181 323.856 442.213 309.909L497.579 296.844C506.042 294.843 512 287.305 512 278.618V233.38C512 224.702 506.032 217.165 497.569 215.166ZM256.006 303.103C230.004 303.103 208.908 282.006 208.908 255.995C208.908 229.984 230.004 208.887 256.006 208.887C282.017 208.887 303.114 229.984 303.114 255.995C303.114 282.006 282.017 303.103 256.006 303.103Z"
          />
        </symbol>

        <symbol id="icon-sundial" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.0796 5.06765C12 5.14181 12 5.2612 12 5.5V11.7113C12 11.8522 12 11.9226 11.9665 11.9807C11.933 12.0387 11.872 12.0739 11.75 12.1443L6.37083 15.25C6.16403 15.3694 6.06063 15.4291 6.03624 15.5351C6.01184 15.6412 6.07559 15.7354 6.20307 15.9237C6.79578 16.7994 7.58052 17.5313 8.5 18.0622C9.56413 18.6766 10.7712 19 12 19C13.2288 19 14.4359 18.6766 15.5 18.0622C16.5641 17.4478 17.4478 16.5641 18.0622 15.5C18.6766 14.4359 19 13.2288 19 12C19 10.7712 18.6766 9.56413 18.0622 8.5C17.4478 7.43587 16.5641 6.5522 15.5 5.93782C14.5805 5.40696 13.5543 5.09331 12.4996 5.01785C12.2727 5.00162 12.1593 4.9935 12.0796 5.06765Z"
          />
        </symbol>

        <mask id="icon-mask-0">
          <rect width="100%" height="100%" fill="white"/>
          <use href="#icon-key" x="17" y="17" width="44" height="44" fill="black"/>
        </mask>
        <mask id="icon-mask-1">
          <rect width="100%" height="100%" fill="white"/>
          <use href="#icon-sundial" x="17" y="17" width="44" height="44" fill="black"/>
        </mask>
        <mask id="icon-mask-2">
          <rect width="100%" height="100%" fill="white"/>
          <use href="#icon-gear" x="17" y="17" width="44" height="44" fill="black"/>
        </mask>
      </defs>

      ${topTiles.join("")}
      ${dots.join("")}
      ${iconTiles.join("")}
    </svg>
  `.trim();
}