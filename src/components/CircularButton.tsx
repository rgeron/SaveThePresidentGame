const CircularButton = () => (
  <button
    className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 flex items-center justify-center w-24 h-24 rounded-full font-sans font-bold text-white text-center z-10"
    onClick={() =>
      window.open(
        "https://cdn.1j1ju.com/medias/ef/63/0c-two-rooms-and-a-boom-rulebook.pdf",
        "_blank"
      )
    } // Replace with the actual URL
  >
    <span>
      Full
      <br />
      rules
    </span>
  </button>
);

export default CircularButton;
