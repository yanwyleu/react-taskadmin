import React, { useEffect } from 'react';
// import { ActionsCellRenderer } from './cells/ActionsCellRenderer';
// import { getData } from './sample-data';
// import { PriceCellRenderer } from './cells/PriceCellRenderer';
import { ProductCellRenderer } from './cells/ProductCellRenderer';
// import { StatusCellRenderer } from './cells/StatusCellRenderer';
// import { StockCellRenderer } from './cells/StockCellRenderer';

import type {
  ColDef,
  GetDetailRowDataParams,
  GridApi,
  GridReadyEvent,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import {
  ClientSideRowModelModule,
} from "ag-grid-community";
// import { ModuleRegistry, ClientSideRowModelModule } from '@ag-grid-community/core';

import "ag-grid-community/styles/ag-grid.min.css";
import "ag-grid-community/styles/ag-theme-material.min.css";

import { AgGridReact } from "ag-grid-react";
import {
  type ChangeEvent,
  type FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import Form from './taskForm';
import Input from '@material-tailwind/react/components/Input';
import { useDispatch } from 'react-redux';
import { useGetPostsQuery, useLazyGetPostsQuery } from '../../services/apis';
// import { fetchTasks, useGetPostsQuery } from '../../services/apis';

// import "ag-grid-community/styles/ag-grid-no-native-widgets.css";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import * as styles from './main.css';

// ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface Props {
  gridTheme?: string;
  isDarkMode?: boolean;
}

const paginationPageSizeSelector = [5, 10, 20];

const statuses = {
  all: "All",
  active: "Active",
  paused: "On Hold",
  outOfStock: "Out of Stock",
};

const statusFormatter: ValueFormatterFunc = ({ value }) =>
  statuses[value as keyof typeof statuses] ?? "";

export const TaskList: FunctionComponent<Props> = ({
  gridTheme = "",
  isDarkMode,
}) => {
  // const dispatch = useDispatch();
  // const tasks = useSelector((state: RootState) => state.tasks);
  const { data: tasks, error, isLoading } = useGetPostsQuery(); // Use RTK Query hook
  const [tasksList, setTasksList ] = useState(tasks || []);

  const gridRef = useRef<AgGridReact>(null);
  const styles = useState({});
  let gridApi: GridApi;
  const onGridReady = (params: GridReadyEvent) => {
    gridApi = params.api;
  };
  
  const [colDefs_] = useState<ColDef[]>([
    {
      field: "product",
      headerName: "Album Name",
      // cellRenderer: ProductCellRenderer,
      // headerClass: "header-product",
      // cellRendererParams: {
      //   innerRenderer: ProductCellRenderer,
      // },
      minWidth: 300,
    },
    { field: "artist" },
    // { field: "category" },
    // { field: "year", width: 150, headerClass: "header-sku" },
    {
      field: "status",
      //   valueFormatter: statusFormatter,
      //   cellRenderer: StatusCellRenderer,
      //   filter: true,
      //   filterParams: {
      //     valueFormatter: statusFormatter,
      //   },
      //   headerClass: "header-status",
    },
    {
      field: "inventory",
      //   cellRenderer: StockCellRenderer,
      //   headerClass: "header-inventory",
      //   sortable: false,
    },
    {
      field: "incoming",
      //   cellEditorParams: {
      //     precision: 0,
      //     step: 1,
      //     showStepperButtons: true,
      //   },
      //   editable: true,
    },
    // {
    //   field: "price",
    //   width: 120,
    //   headerClass: "header-price",
    //   cellRenderer: PriceCellRenderer,
    // },
    // { field: "sold", headerClass: "header-calendar" },
    // {
    //   headerName: "Est. Profit",
    //   colId: "profit",
    //   headerClass: "header-percentage",
    //   cellDataType: "number",
    //   valueGetter: ({ data: { price, sold } }: ValueGetterParams) =>
    //     (price * sold) / 10,
    //   valueFormatter: ({ value }: ValueFormatterParams) => `£${value}`,
    //   width: 150,
    // },
    // { field: "actions", cellRenderer: ActionsCellRenderer, minWidth: 194 },
  ]);
  // const [rowData] = useState(getData());
  const defaultColDef = useMemo<ColDef>(
    () => ({
      editable: false,
      flex: 1,
      filter: false,
      resizable: false,
      minWidth: 300,
      width: 100,
    }),
    []
  );
  const autoSizeStrategy = useMemo(
    () => ({
      type: "fitGridWidth",
    }),
    []
  );
  const themeClass = isDarkMode ? `${gridTheme}-dark` : gridTheme;
  const [quickFilterText, setQuickFilterText] = useState<string>();
  const onFilterTextBoxChanged = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setQuickFilterText(value),
    []
  );

  // const detailCellRendererParams = useMemo(
  //   () => ({
  //     detailGridOptions: {
  //       columnDefs: [
  //         { field: "title", flex: 1.5 },
  //         { field: "available", maxWidth: 120 },
  //         { field: "format", flex: 2 },
  //         { field: "label", flex: 1 },
  //         { field: "country", flex: 0.66 },
  //         {
  //           field: "cat",
  //           headerName: "Cat#",
  //           type: "rightAligned",
  //           flex: 0.66,
  //         },
  //         { field: "year", type: "rightAligned", maxWidth: 80 },
  //       ],
  //       headerHeight: 38,
  //     },
  //     getDetailRowData: ({
  //       successCallback,
  //       data: { variantDetails },
  //     }: GetDetailRowDataParams) => successCallback(variantDetails),
  //   }),
  //   []
  // );
  const [activeTab, setActiveTab] = useState("all");
  const handleTabClick = useCallback((status: string) => {
    setActiveTab(status);
    gridRef
      .current!.api.setColumnFilterModel(
        "status",
        status === "all" ? null : { values: [status] }
      )
      .then(() => gridRef.current!.api.onFilterChanged());
  }, []);

  const rowData_ = useState(() => {
    const rowData = [];
    for (let i = 0; i < 10; i++) {
      rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
      rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
      rowData.push({
        make: "Porsche",
        model: "Boxster",
        price: 72000 + i * 1000,
      });
    }
    return rowData;
  });

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "taskID",
      // rowGroup: false,
      width: 170,
      // enableRowGroup: false,
      // enablePivot: false,
      // pinned: true,
      // editable: false,
      // cellRenderer: ProductCellRenderer,
    },
    { field: "title", rowGroup: false },
    { field: "description", rowGroup: false },
    { field: "status", rowGroup: false }
  ]);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "make",
      headerName: "#",
      width: 40,
      checkboxSelection: true,
      sortable: false,
      suppressMenu: true,
      filter: false,
      pinned: true
    },
    // { field: "sport" },
    // { field: "age" },
  ]);

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 200,
    };
  }, []);

  // const columnDefs: ColDef[] = [
  //   // {
  //   //   headerName: "ID",
  //   //   field: "id",
  //   //   width: 70
  //   // },
  //   {
  //     headerName: "Athlete",
  //     field: "athlete",
  //     width: 150,
  //     editable: true
  //   },
  //   {
  //     headerName: "Age",
  //     field: "age",
  //     width: 90,
  //     minWidth: 50,
  //     maxWidth: 100,
  //     editable: true
  //   },
  //   // {
  //   //   headerName: "Country",
  //   //   field: "country",
  //   //   width: 120
  //   // },
  //   // {
  //   //   headerName: "Year",
  //   //   field: "year",
  //   //   width: 90
  //   // },
  //   // {
  //   //   headerName: "Date",
  //   //   field: "date",
  //   //   width: 110
  //   // },
  //   // {
  //   //   headerName: "Sport",
  //   //   field: "sport",
  //   //   width: 110
  //   // },
  //   // {
  //   //   headerName: "Gold",
  //   //   field: "gold",
  //   //   width: 100
  //   // },
  //   // {
  //   //   headerName: "Silver",
  //   //   field: "silver",
  //   //   width: 100
  //   // },
  //   // {
  //   //   headerName: "Bronze",
  //   //   field: "bronze",
  //   //   width: 100
  //   // },
  //   // {
  //   //   headerName: "Total",
  //   //   field: "total",
  //   //   width: 100
  //   // }
  // ];

  const _rowData = [
    {
      athlete: "Michael Phelps",
      "age": 23,
      "country": "United States",
      "year": 2008,
      "date": "24/08/2008",
      "sport": "Swimming",
      "gold": 8,
      "silver": 0,
      "bronze": 0,
      "total": 8
    },
    {
      "athlete": "Michael Phelps",
      "age": 19,
      "country": "United States",
      "year": 2004,
      "date": "29/08/2004",
      "sport": "Swimming",
      "gold": 6,
      "silver": 0,
      "bronze": 2,
      "total": 8
    },
    {
      "athlete": "Michael Phelps",
      "age": 27,
      "country": "United States",
      "year": 2012,
      "date": "12/08/2012",
      "sport": "Swimming",
      "gold": 4,
      "silver": 2,
      "bronze": 0,
      "total": 6
    },
    {
      "athlete": "Natalie Coughlin",
      "age": 25,
      "country": "United States",
      "year": 2008,
      "date": "24/08/2008",
      "sport": "Swimming",
      "gold": 1,
      "silver": 2,
      "bronze": 3,
      "total": 6
    },
    {
      "athlete": "Aleksey Nemov",
      "age": 24,
      "country": "Russia",
      "year": 2000,
      "date": "01/10/2000",
      "sport": "Gymnastics",
      "gold": 2,
      "silver": 1,
      "bronze": 3,
      "total": 6
    },
    {
      "athlete": "Alicia Coutts",
      "age": 24,
      "country": "Australia",
      "year": 2012,
      "date": "12/08/2012",
      "sport": "Swimming",
      "gold": 1,
      "silver": 3,
      "bronze": 1,
      "total": 5
    },
    {
      "athlete": "Missy Franklin",
      "age": 17,
      "country": "United States",
      "year": 2012,
      "date": "12/08/2012",
      "sport": "Swimming",
      "gold": 4,
      "silver": 0,
      "bronze": 1,
      "total": 5
    },
    {
      "athlete": "Ryan Lochte",
      "age": 27,
      "country": "United States",
      "year": 2012,
      "date": "12/08/2012",
      "sport": "Swimming",
      "gold": 2,
      "silver": 2,
      "bronze": 1,
      "total": 5
    },
    {
      "athlete": "Allison Schmitt",
      "age": 22,
      "country": "United States",
      "year": 2012,
      "date": "12/08/2012",
      "sport": "Swimming",
      "gold": 3,
      "silver": 1,
      "bronze": 1,
      "total": 5
    },
    {
      "athlete": "Natalie Coughlin",
      "age": 21,
      "country": "United States",
      "year": 2004,
      "date": "29/08/2004",
      "sport": "Swimming",
      "gold": 2,
      "silver": 2,
      "bronze": 1,
      "total": 5
    },
    {
      "athlete": "Ian Thorpe",
      "age": 17,
      "country": "Australia",
      "year": 2000,
      "date": "01/10/2000",
      "sport": "Swimming",
      "gold": 3,
      "silver": 2,
      "bronze": 0,
      "total": 5
    }]

  interface FormValues {
    keyword: string;
  }  
  const [keywordInput, setKeywordInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // setValues({ ...values, [name]: value });
    // setErrors({ ...errors, [name]: undefined });
    console.log('keyword-change:', name, value)
    setKeywordInput(value);
  };

  useEffect(() => {
    console.log('list-loading?', isLoading, tasks)
    if (tasks) {
      try {

        setTasksList(tasks);
        console.log('list-task?', tasksList)
        gridApi.redrawRows();
      } catch (e) {
        console.log('refresh-cell-err:', e)
      }

    }
  }, [tasks]);
  
  return (
    <div className='ag-theme-material w-full h-full bg-blue-gray-50/50'>
      <div className='amx-auto'>
        <div className='w-full ajustify-center px-6 py-12'>
          {/* <div className='lg:w-5/12'>
            <div style={{ border: 'solid 2px #f0f' }}>
              <Form />
            </div>
          </div> */}
          <div className='h-full' style={{ height: '100vh' }}>
            <div className='w-full py-3'>
              <Input
                label='Keywords'
                onChange={handleChange}
                color="gray"
                size="lg"
                placeholder="Keywords"
                name="keyword"
                className="focus:border-t-gray-900"
                // containerProps={{
                //   className: "min-w-full",
                // }}
                labelProps={{
                  className: "hidden",
                }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}              />
            </div>
            <div className='w-full h-full py-3'>
              <AgGridReact
                debug
                // theme="legacy"
                // ref={gridRef}
                columnDefs={colDefs}
                // columnDefs={[
                //   {
                //     field: "athlete",
                //     headerName: "athlete",
                //     width: 120,
                //     sortable: false,
                //   },
                // ]}
                quickFilterText={keywordInput}
                onGridReady={onGridReady}
                rowData={tasksList}
                defaultColDef={{
                  flex: 1,
                  resizable: false,
                  sortable: true,
                  filter: true,
                  headerComponentParams: {
                    menuIcon: 'fa-bars'
                  }
                }}
              // rowHeight={80}
              // autoSizeStrategy={autoSizeStrategy}
              //  modules={[ClientSideRowModelModule]}
              // pagination
              // paginationPageSize={10}
              // paginationPageSizeSelector={paginationPageSizeSelector}
              // masterDetail
              // detailCellRendererParams={detailCellRendererParams}
              // quickFilterText={quickFilterText}
              // detailRowAutoHeight
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
