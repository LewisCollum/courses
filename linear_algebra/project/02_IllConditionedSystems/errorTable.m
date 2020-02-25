function errorTable(i, errors, conditions)
  printf("  n     error\t\t  cond\n");
  for n = i
    printf("%3i\t| %.3E\t| %.3E\n", n, errors(n), conditions(n));
  end
end
