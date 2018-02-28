import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

export default {
  userData: new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/userdata.json')
  })
}
