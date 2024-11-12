import { CloseCircleOutlined } from '@ant-design/icons';
import React, { Dispatch, SetStateAction } from 'react';

import { Button } from '@/components/ui';
import { Method } from '@/utils';
import { GraphHistory } from 'app/hooks/useGraphHistory';

export type History = {
  method?: Method;
  url: string;
  variables?: ChangeItem[];
  value: string;
  headers: ChangeItem[];
};

type onHistoryProps = History | GraphHistory;

interface HistoryProps {
  history: History[];
  onHistory: (item: History) => void;
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export const History = ({
  history,
  onHistory,
  isOpen,
  onClose,
}: HistoryProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50"
          onClick={() => onClose(false)}
        >
          <div
            className="bg-background max-h-[80vh] rounded-lg shadow-lg p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 px-4 bg-background flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Request History</h2>
              <Button variant="ghost" onClick={() => onClose(false)}>
                <CloseCircleOutlined />
              </Button>
            </div>
            <ul className="overflow-y-auto max-h-[40vh]">
              {!history.length && (
                <p>
                  You haven&apos;t made any requests yet. Feel free to explore
                  the REST and GraphQL pages to get started
                </p>
              )}
              {history &&
                history.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      onHistory(item);
                      onClose(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-accent rounded-md transition"
                  >
                    <p>
                      {'method' in item && (
                        <span className="font-bold mr-2 text-grayText">
                          {item.method}
                        </span>
                      )}
                      {item.url}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
