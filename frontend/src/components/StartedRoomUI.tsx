import { useEffect, useState } from "react";
import { useSocket } from "@/stores/SocketProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Editor from "@monaco-editor/react";

function StartedRoomUI({ room }: any) {
  const [timer, setTimer] = useState(0);
  const [questions, setQuestions] = useState([]);
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleRoomTimer = ({ remaining }: { remaining: number }) => {
      setTimer(remaining);
    };

    const handleGetQuestions = (questions: any) => {
      setQuestions(questions);
    };

    socket.on("room-timer", handleRoomTimer);
    socket.on("room-questions", handleGetQuestions);

    return () => {
      socket.off("room-timer", handleRoomTimer);
      socket.off("room-questions", handleGetQuestions);
    };
  }, [socket]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const currentQuestion:any = questions[0];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between bg-muted rounded-xl px-6 py-4">
        <h2 className="text-xl font-semibold">{room.name} Started</h2>
        <div className="text-2xl font-bold text-green-600">
          ⏱ {formatTime(timer)}
        </div>
      </div>

      {currentQuestion && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {currentQuestion.title}
                <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
              </CardTitle>
              <CardDescription>
                Language: {currentQuestion.language}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {currentQuestion.description}
              </p>
              <div>
                <span className="font-medium">Function Signature:</span>
                <pre className="bg-muted px-4 py-2 rounded text-sm mt-1">
                  {currentQuestion.function}
                </pre>
              </div>

              <div>
                <span className="font-medium">Test Cases:</span>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {currentQuestion.testCases.map((tc: any, i: number) => (
                    <li key={i}>
                      <code>Input: {tc.input}</code>,{" "}
                      <code>Expected: {tc.expected}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
            <div className="h-[500px] border rounded-xl overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage={currentQuestion.language.toLowerCase()}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StartedRoomUI;
