import React from 'react'
import settings from 'config'
import { Icon, Text, TableCell, TableRow, Link } from 'blockchain-info-components'

const AddressesTableEntry = ({ entry, deriveAddress, onEditLabel, onDeleteLabel }) => (
  <TableRow key={entry.index}>
    <TableCell width='40%'>
      <Link href={`${settings.ROOT_URL}address/${deriveAddress(entry.index)}`} size='small' weight={300} target='_blank'>
        {deriveAddress(entry.index)}
      </Link>
    </TableCell>
    <TableCell width='40%'>
      <Text size='13px'>{entry.label}</Text>
    </TableCell>
    <TableCell style={{ display: 'flex', justifyContent: 'flex-end' }} width='20%'>
      <Icon name='pencil' onClick={() => onEditLabel(entry.index)} style={{ marginRight: 10 }} />
      <Icon name='trash' onClick={() => onDeleteLabel(entry.index)} />
    </TableCell>
  </TableRow>
)

export default AddressesTableEntry
