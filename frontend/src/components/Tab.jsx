function Tab({ children, isActive, ...props }) {
    return (
<button
    className={`px-4 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-400'}`}
    {...props}
>
    {children}
</button>

    );
}

export default Tab;