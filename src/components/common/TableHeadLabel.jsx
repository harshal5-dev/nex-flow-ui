const TableHeadLabel = ({ Icon, label }) => {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/80">
      <Icon className="size-3.5 text-muted-foreground" />
      {label}
    </span>
  );
};

export default TableHeadLabel;
