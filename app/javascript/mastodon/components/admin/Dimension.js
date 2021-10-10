import React from 'react';
import PropTypes from 'prop-types';
import api from 'mastodon/api';
import { FormattedNumber } from 'react-intl';
import { roundTo10 } from 'mastodon/utils/numbers';
import Skeleton from 'mastodon/components/skeleton';

export default class Dimension extends React.PureComponent {

  static propTypes = {
    dimension: PropTypes.string.isRequired,
    start_at: PropTypes.string.isRequired,
    end_at: PropTypes.string.isRequired,
    limit: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  };

  state = {
    loading: true,
    data: null,
  };

  componentDidMount () {
    const { start_at, end_at, dimension, limit } = this.props;

    api().post('/api/v1/admin/dimensions', { keys: [dimension], start_at, end_at, limit }).then(res => {
      this.setState({
        loading: false,
        data: res.data,
      });
    }).catch(err => {
      console.error(err);
    });
  }

  render () {
    const { label, limit } = this.props;
    const { loading, data } = this.state;

    let content;

    if (loading) {
      content = (
        <table>
          <tbody>
            {Array.from(Array(limit)).map((_, i) => (
              <tr className='dimension__item' key={i}>
                <td className='dimension__item__key'>
                  <Skeleton width={100} />
                </td>

                <td className='dimension__item__value'>
                  <Skeleton width={60} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      const sum = data[0].data.reduce((sum, cur) => sum + (cur.value * 1), 0);

      content = (
        <table>
          <tbody>
            {data[0].data.map(item => (
              <tr className='dimension__item' key={item.key}>
                <td className='dimension__item__key'>
                  <span className={`dimension__item__indicator dimension__item__indicator--${roundTo10(((item.value * 1) / sum) * 100)}`} />
                  <span>{item.human_key}</span>
                </td>

                <td className='dimension__item__value'>
                  {typeof item.human_value !== 'undefined' ? item.human_value : <FormattedNumber value={item.value} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div className='dimension'>
        <h4>{label}</h4>

        {content}
      </div>
    );
  }

}
