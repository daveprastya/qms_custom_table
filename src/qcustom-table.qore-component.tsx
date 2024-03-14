import React, { useMemo } from "react";
import { registerComponent } from "@qorebase/app-cli";
import { Box, Text, Stack, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Tag, TagLabel } from "@chakra-ui/react";

const qCustomTable = registerComponent("qCustomTable", {
  type: "list",
  icon: "TableAlt",
  group: "data",
  propDefinition: {
    title: { group: "Text", type: 'expression', options: {}},
    que_type: {
      group: "Text",
      type: 'string',
      options: {
        format: 'select',
        options: [
          { label: "Online", value: "online" },
          { label: "Walk-In", value: 'walkin'}
        ]
      }
    },
    itemAction: {
      group: "Actions",
      type: "action",
      options: { type: "none" },
    }
  },
  defaultProps: {
    // Set Props Default Value
    title: "Table title",
    que_type: 'online',
    itemAction: { type: "none" },
  },
  Component: (props: any) => {
    const source = props.source.target
    const title = props.properties.title
    const tableRowData = props.data.component?.rows
    const que_type = props.properties.que_type

    const rowDatas = useMemo(() => {
      const datas = tableRowData.map((data:any) => {
        return data
      })
      return datas
    },[tableRowData, que_type])

    const columns = useMemo(() => {
      return que_type == "online" ? [ 
        {name: "CUSTOMER NAME"}, 
        {name: "SERVICE GROUP"}, 
        {name: "BOOKING TIME"}, 
        {name: "STATUS"}, 
        {name: "ACTION"} ] : [
          {name: "QUE"},
          {name: "CURRENT QUE"},
          {name: "TOTAL QUE"},
          {name: "CURRENT QUE"},
          {name: "ACTION"}
        ] 
    }, [que_type]);

    return (
      <Box w="100%" p="5">
        <Stack my="5">
          <Text fontWeight={'bold'} fontSize="xl">
            {title}
          </Text>
        </Stack>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr backgroundColor="#F5F5F5" height="40px">
                {columns.map((props) => {
                  return (
                  <Th>{props.name}</Th>
                )})}
              </Tr>
            </Thead>
            <Tbody>
              {rowDatas.map((row:any, i:number) => (
                <props.components.ListItemVariables
                  key={i}
                  variables={rowDatas[i]}
                >
                  <RowItems 
                    {...props}
                    row={row}
                    index={i}
                    que_type={que_type}
                  />
                </props.components.ListItemVariables>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    )
  },
});

const RowItems: React.FC = (props:any) => {
  const que_type = props.que_type;
  const row = props.row;
  const index = props.index;

  const actionButton = props.hooks.useActionTrigger(
    props.properties.itemAction,
    row.id,
    props.pageSource
  )

  if (que_type == "online") {
    return (
      <Tr key={index}>
        <Td>{row.user_name || "-"}</Td>
        <Td>{row.booking_category || "-"}</Td>
        <Td>{row.schedule_time || "-"}</Td>
        <Td>
          <Tag size="md" variant="solid" backgroundColor="#FDF1E6">
            <TagLabel color="#EE7105">{row.status || "-"}</TagLabel>
          </Tag>
        </Td>
        <Td><Button onClick={() => actionButton.handleClick()}>Panggil</Button></Td>
      </Tr>
    )
  } else {
    return (
      <Tr key={index}>
        <Td>{row.name || "-"}</Td>
        <Td>{row.current_que || "-"}</Td>
        <Td>{row.number || "-"}</Td>
        <Td>{row.current_number || "-" }</Td>
        <Td><Button onClick={() => actionButton.handleClick()} disabled={row.current_number > row.number}>Panggil</Button></Td>
      </Tr>
    )
  }
}

export default qCustomTable;

