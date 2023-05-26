function Input({ id, placeholder, labelBgColor, value, onChange, ...props }) {
    return (
      <div className="flex flex-col mb-4">
        <input
          id={id}
          placeholder={placeholder}
          className="bg-zinc-800 font-light rounded-lg px-4 py-1 focus:outline-none"
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  }

export default Input