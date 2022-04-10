import {
  Component,
  ErrorInfo,
  ReactNode,
  Suspense,
  useState,
  VFC,
} from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Issue, useIssueQuery } from "./github-hooks";
import { QueryErrorResetBoundary } from "react-query";
import { ErrorOutline } from "@mui/icons-material";

export const IssuesContainer: VFC = () => {
  const [labelsInput, setLabelsInput] = useState("");
  const [labels, setLabels] = useState("");

  return (
    <Container>
      <TextField
        value={labelsInput}
        label="Labels"
        onChange={(e) => setLabelsInput(e.target.value)}
      />
      <Button onClick={() => setLabels(labelsInput)}>Search</Button>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset}>
            <Suspense
              fallback={
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>User</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...Array(5)].map((_, i) => {
                        return (
                          <TableRow
                            key={i}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Skeleton variant="text" />
                            </TableCell>
                            <TableCell>
                              <Skeleton variant="text" />
                            </TableCell>
                            <TableCell>
                              <Skeleton variant="text" />
                            </TableCell>
                            <TableCell>
                              <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                              />
                              <Skeleton variant="text" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            >
              <Issues labels={labels} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Container>
  );
};

interface IssuesProps {
  labels: string;
}

const Issues: VFC<IssuesProps> = ({ labels }) => {
  const { data } = useIssueQuery(labels);
  return (
    <Paper>
      {data?.length ? (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.number}
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.state}</TableCell>
                <TableCell>
                  <Avatar src={row.user.avatar_url} />
                  {row.user.login}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>
          <ErrorOutline />
          There are no issues found
        </Typography>
      )}
    </Paper>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    console.log(this.props.onReset);
    if (this.state.hasError) {
      return (
        <>
          <h1>Error: Failed to fetch data.</h1>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset();
            }}
          >
            retry
          </Button>
        </>
      );
    }

    return this.props.children;
  }
}
